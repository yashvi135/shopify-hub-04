const express = require('express');
const router = express.Router();
const HomePageSection = require('../models/HomePageSection');
const axios = require('axios');

const BUYER_APP_URL = process.env.BUYER_APP_URL || 'http://localhost:3000';

// ─── Helper: push one section to buyer app ────────────────────────────────────
async function syncSectionToBuyerApp(section) {
  try {
    await axios.post(`${BUYER_APP_URL}/api/sync/home-section`, {
      adminSectionId: section._id.toString(),
      adminStoreId:   section.storeId,
      sectionType:    section.sectionType,
      templateType:   section.templateType,
      title:          section.title,
      displayOrder:   section.displayOrder,
      isActive:       section.isActive,
      isLocked:       section.isLocked,
      config:         section.config || {},
    });
  } catch (err) {
    console.error('[Sync] Failed to sync section to buyer app:', err.message);
  }
}

// ─── Helper: push all sections for a store to buyer app ──────────────────────
async function syncAllSectionsToBuyerApp(storeId) {
  try {
    const sections = await HomePageSection.find({ storeId }).sort({ displayOrder: 1 });
    await Promise.all(sections.map(syncSectionToBuyerApp));
  } catch (err) {
    console.error('[Sync] Failed to sync all sections:', err.message);
  }
}

// ─── GET /api/home-sections?storeId=xxx ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).json({ success: false, message: 'storeId is required' });

    const sections = await HomePageSection.find({ storeId }).sort({ displayOrder: 1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/home-sections (create a new unlocked section) ─────────────────
router.post('/', async (req, res) => {
  try {
    const { storeId, sectionType, templateType, title, config } = req.body;
    if (!storeId) return res.status(400).json({ success: false, message: 'storeId is required' });

    if (sectionType === 'SEARCH_BANNER' || sectionType === 'CATEGORY_GRID') {
      return res.status(400).json({ success: false, message: 'This section type is managed automatically.' });
    }

    const existingSections = await HomePageSection.find({ storeId }).sort({ displayOrder: 1 });
    const categoryGrid     = existingSections.find(s => s.sectionType === 'CATEGORY_GRID');
    const newOrder         = categoryGrid ? categoryGrid.displayOrder : (existingSections.length + 1);

    if (categoryGrid) {
      await HomePageSection.findByIdAndUpdate(categoryGrid._id, { displayOrder: newOrder + 1 });
      // Sync updated CATEGORY_GRID order to buyer app
      const updatedGrid = await HomePageSection.findById(categoryGrid._id);
      syncSectionToBuyerApp(updatedGrid);
    }

    const section = await HomePageSection.create({
      storeId, sectionType, templateType,
      title, displayOrder: newOrder, config: config || {},
    });

    // Sync new section to buyer app
    syncSectionToBuyerApp(section);

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── PUT /api/home-sections/:id (update title / templateType / isActive) ─────
router.put('/:id', async (req, res) => {
  try {
    const section = await HomePageSection.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const { title, templateType, config, isActive } = req.body;
    const updated = await HomePageSection.findByIdAndUpdate(
      req.params.id,
      { title, templateType, config, isActive },
      { new: true, runValidators: true }
    );

    // Sync updated section to buyer app
    syncSectionToBuyerApp(updated);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE /api/home-sections/:id ───────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const section = await HomePageSection.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    if (section.isLocked) return res.status(403).json({ success: false, message: 'This section is locked and cannot be deleted.' });

    const { storeId, displayOrder } = section;
    const adminSectionId = section._id.toString();
    await section.deleteOne();

    // Re-order remaining sections
    await HomePageSection.updateMany(
      { storeId, displayOrder: { $gt: displayOrder } },
      { $inc: { displayOrder: -1 } }
    );

    // Fire-and-forget: delete from buyer app + re-sync all remaining to fix order
    axios.delete(`${BUYER_APP_URL}/api/sync/home-section/${adminSectionId}`)
      .catch(err => console.error('[Sync] Delete section failed:', err.message));
    syncAllSectionsToBuyerApp(storeId);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── PUT /api/home-sections/reorder/:id ──────────────────────────────────────
router.put('/reorder/:id', async (req, res) => {
  try {
    const { direction } = req.body;
    const section = await HomePageSection.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    if (section.isLocked) return res.status(403).json({ success: false, message: 'This locked section cannot be reordered.' });

    const allSections = await HomePageSection.find({ storeId: section.storeId }).sort({ displayOrder: 1 });
    const idx         = allSections.findIndex(s => s._id.toString() === req.params.id);
    const swapIdx     = direction === 'up' ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= allSections.length) {
      return res.status(400).json({ success: false, message: 'Cannot move section further.' });
    }

    const swapTarget = allSections[swapIdx];
    if (swapTarget.isLocked) {
      return res.status(403).json({ success: false, message: 'Cannot move past a locked section.' });
    }

    // Swap display orders
    const tempOrder = section.displayOrder;
    await HomePageSection.findByIdAndUpdate(section._id,     { displayOrder: swapTarget.displayOrder });
    await HomePageSection.findByIdAndUpdate(swapTarget._id,  { displayOrder: tempOrder });

    const updatedSections = await HomePageSection.find({ storeId: section.storeId }).sort({ displayOrder: 1 });

    // Sync all reordered sections to buyer app
    syncAllSectionsToBuyerApp(section.storeId);

    res.status(200).json({ success: true, data: updatedSections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/home-sections/init ─────────────────────────────────────────────
router.post('/init', async (req, res) => {
  try {
    const { storeId } = req.body;
    if (!storeId) return res.status(400).json({ success: false, message: 'storeId is required' });

    const existing = await HomePageSection.findOne({ storeId });
    if (existing) return res.status(200).json({ success: true, message: 'Already initialized' });

    const defaults = await HomePageSection.insertMany([
      { storeId, sectionType: 'SEARCH_BANNER',  templateType: 'SEARCH_GRID',   title: 'Search & Banner',  displayOrder: 1, isLocked: true  },
      { storeId, sectionType: 'CATEGORY_GRID',  templateType: 'CATEGORY_GRID', title: 'Shop by Category', displayOrder: 2, isLocked: true  },
    ]);

    // Sync both locked sections to buyer app
    syncAllSectionsToBuyerApp(storeId);

    res.status(201).json({ success: true, message: 'Default sections initialized', data: defaults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/home-sections/resync ───────────────────────────────────────────
// Force re-push all sections for a store to the buyer app (useful after data reset)
router.post('/resync', async (req, res) => {
  try {
    const { storeId } = req.body;
    if (!storeId) return res.status(400).json({ success: false, message: 'storeId is required' });

    const sections = await HomePageSection.find({ storeId }).sort({ displayOrder: 1 });
    await syncAllSectionsToBuyerApp(storeId);

    res.status(200).json({ success: true, message: `Re-synced ${sections.length} sections to buyer app` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
