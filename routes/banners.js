const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { uploadBannerImages, uploadBannerVideo } = require('../middleware/upload');
const axios = require('axios');

const BUYER_APP_URL = process.env.BUYER_APP_URL || 'http://localhost:3000';

// ─── Helper: push one banner to buyer app ─────────────────────────────────────
async function syncBannerToBuyerApp(banner) {
  try {
    await axios.post(`${BUYER_APP_URL}/api/sync/banner`, {
      adminBannerId:   banner._id.toString(),
      title:           banner.title,
      description:     banner.description,
      bannerType:      banner.bannerType,
      position:        banner.position,
      mediaType:       banner.mediaType,
      videoUrl:        banner.videoUrl,
      mediaImages:     banner.mediaImages,
      backgroundImage: banner.backgroundImage,
      link:            banner.link,
      linkType:        banner.linkType,
      linkId:          banner.linkId,
      displayOrder:    banner.displayOrder,
      isActive:        banner.isActive,
      startDate:       banner.startDate,
      endDate:         banner.endDate,
      storeId:         banner.storeId,
    });
  } catch (err) {
    console.error('[Sync] Failed to sync banner to buyer app:', err.message);
  }
}

// ─── Helper: parse common body fields ────────────────────────────────────────
function parseCommonFields(reqData) {
  return {
    title:        reqData.title,
    description:  reqData.description,
    bannerType:   reqData.bannerType  || 'PROMOTIONAL',
    position:     reqData.position    || 'FRONTEND',
    mediaType:    reqData.mediaType   || 'IMAGES',
    link:         reqData.link,
    linkType:     reqData.linkType    || 'none',
    linkId:       reqData.linkId,
    displayOrder: reqData.displayOrder ? Number(reqData.displayOrder) : 0,
    isActive:     reqData.isActive === 'true' || reqData.isActive === true,
    startDate:    reqData.startDate ? new Date(reqData.startDate) : undefined,
    endDate:      reqData.endDate   ? new Date(reqData.endDate)   : undefined,
    storeId:      reqData.storeId,
  };
}

// ─── GET /api/banners ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { storeId, bannerType, position } = req.query;
    const query = {};
    if (storeId)    query.storeId    = storeId;
    if (bannerType) query.bannerType = bannerType;
    if (position)   query.position   = position;

    const banners = await Banner.find(query).sort({ displayOrder: 1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── POST /api/banners/images ─────────────────────────────────────────────────
// Creates a banner with image files (FRONTEND or BACKGROUND+IMAGES).
// Accepts:
//   - "mediaImages"  : multiple files  (carousel images or background slideshow)
//   - "backgroundImage" : single file  (static backdrop for FRONTEND only)
router.post(
  '/images',
  uploadBannerImages.fields([
    { name: 'mediaImages',     maxCount: 20 },
    { name: 'backgroundImage', maxCount: 1  },
  ]),
  async (req, res) => {
    try {
      const reqData = req.body;
      const data = parseCommonFields(reqData);

      // Edge case: FRONTEND position cannot use VIDEO
      if (data.position === 'FRONTEND' && data.mediaType === 'VIDEO') {
        return res.status(400).json({ success: false, message: 'Video is not allowed for Frontend position banners.' });
      }

      // Edge case: BACKGROUND position cannot have a backgroundImage
      if (data.position === 'BACKGROUND') {
        data.backgroundImage = undefined;
      }

      // Attach uploaded files
      if (req.files?.mediaImages) {
        data.mediaImages = req.files.mediaImages.map(f => f.path);
      }
      if (req.files?.backgroundImage?.[0] && data.position === 'FRONTEND') {
        data.backgroundImage = req.files.backgroundImage[0].path;
      }

      // Edge case: FRONTEND must have at least 1 carousel image
      if (data.position === 'FRONTEND' && (!data.mediaImages || data.mediaImages.length === 0)) {
        return res.status(400).json({ success: false, message: 'At least one carousel image is required for Frontend banners.' });
      }

      // Edge case: BACKGROUND+IMAGES must have at least 1 image
      if (data.position === 'BACKGROUND' && data.mediaType === 'IMAGES' && (!data.mediaImages || data.mediaImages.length === 0)) {
        return res.status(400).json({ success: false, message: 'At least one background image is required.' });
      }

      const banner = await Banner.create(data);

      // Sync to buyer app
      if (banner.isActive) {
        syncBannerToBuyerApp(banner);
      }

      res.status(201).json({ success: true, data: banner });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ─── POST /api/banners/video ──────────────────────────────────────────────────
// Creates a BACKGROUND banner with a single video. Enforces 1 video per store per section.
router.post(
  '/video',
  uploadBannerVideo.single('videoFile'),
  async (req, res) => {
    try {
      const reqData = req.body;
      const data = parseCommonFields(reqData);

      // Edge case: only BACKGROUND position can use VIDEO
      if (data.position !== 'BACKGROUND') {
        return res.status(400).json({ success: false, message: 'Video is only allowed for Background position banners.' });
      }
      data.mediaType = 'VIDEO';

      // Edge case: enforce only 1 video per store per bannerType section
      const existingVideo = await Banner.findOne({
        storeId: data.storeId,
        bannerType: data.bannerType,
        position: 'BACKGROUND',
        mediaType: 'VIDEO',
      });
      if (existingVideo) {
        return res.status(400).json({
          success: false,
          message: 'Only 1 background video is allowed per section. Please delete the existing video banner first.',
          existingId: existingVideo._id,
        });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'A video file is required.' });
      }
      data.videoUrl = req.file.path;
      data.mediaImages = [];

      const banner = await Banner.create(data);

      // Sync to buyer app
      if (banner.isActive) {
        syncBannerToBuyerApp(banner);
      }

      res.status(201).json({ success: true, data: banner });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ─── PUT /api/banners/:id/images ──────────────────────────────────────────────
// Update an image-based banner (add/replace media images)
router.put(
  '/:id/images',
  uploadBannerImages.fields([
    { name: 'mediaImages',     maxCount: 20 },
    { name: 'backgroundImage', maxCount: 1  },
  ]),
  async (req, res) => {
    try {
      let banner = await Banner.findById(req.params.id);
      if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

      const reqData = req.body;
      const updates = {};

      if (reqData.title)       updates.title       = reqData.title;
      if (reqData.description  !== undefined) updates.description  = reqData.description;
      if (reqData.link         !== undefined) updates.link         = reqData.link;
      if (reqData.linkType)    updates.linkType    = reqData.linkType;
      if (reqData.linkId       !== undefined) updates.linkId       = reqData.linkId;
      if (reqData.isActive     !== undefined) updates.isActive     = reqData.isActive === 'true' || reqData.isActive === true;
      if (reqData.startDate)   updates.startDate   = new Date(reqData.startDate);
      if (reqData.endDate)     updates.endDate     = new Date(reqData.endDate);
      if (reqData.displayOrder !== undefined) updates.displayOrder = Number(reqData.displayOrder);

      // If new files uploaded — replace (or you can append by merging arrays)
      if (req.files?.mediaImages) {
        updates.mediaImages = req.files.mediaImages.map(f => f.path);
      }
      if (req.files?.backgroundImage?.[0] && banner.position === 'FRONTEND') {
        updates.backgroundImage = req.files.backgroundImage[0].path;
      }

      banner = await Banner.findByIdAndUpdate(req.params.id, updates, { new: true });

      // Sync to buyer app
      syncBannerToBuyerApp(banner);

      res.status(200).json({ success: true, data: banner });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ─── PUT /api/banners/:id/toggle ─────────────────────────────────────────────
// Toggle isActive quickly
router.put('/:id/toggle', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    banner.isActive = !banner.isActive;
    await banner.save();

    // Sync to buyer app
    syncBannerToBuyerApp(banner);

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── PUT /api/banners/:id/reorder ────────────────────────────────────────────
// Update displayOrder for drag-and-drop or arrow reorder
router.put('/:id/reorder', async (req, res) => {
  try {
    const { direction } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const siblings = await Banner.find({
      storeId: banner.storeId,
      bannerType: banner.bannerType,
      position: banner.position,
    }).sort({ displayOrder: 1 });

    const idx = siblings.findIndex(b => b._id.toString() === req.params.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= siblings.length) {
      return res.status(400).json({ success: false, message: 'Cannot move further.' });
    }

    const swapTarget = siblings[swapIdx];
    const tempOrder = banner.displayOrder;
    await Banner.findByIdAndUpdate(banner._id, { displayOrder: swapTarget.displayOrder });
    await Banner.findByIdAndUpdate(swapTarget._id, { displayOrder: tempOrder });

    const updated = await Banner.find({
      storeId: banner.storeId,
      bannerType: banner.bannerType,
      position: banner.position,
    }).sort({ displayOrder: 1 });

    // Sync all reordered banners to buyer app to ensure order is fixed
    updated.forEach(syncBannerToBuyerApp);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE /api/banners/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    await banner.deleteOne();
    axios.delete(`${BUYER_APP_URL}/api/sync/banner/${banner._id}`).catch(() => {});
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
