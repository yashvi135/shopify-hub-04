const axios = require('axios');

const BUYER_APP_URL = process.env.BUYER_APP_URL || 'http://localhost:3000';

/**
 * Centralized Sync Service for Admin Panel -> Buyer App
 */
const syncService = {
  
  /**
   * Sync a Product to Buyer App
   */
  syncProduct: async (product) => {
    try {
      // Ensure category is populated for its name (if it's a Mongoose document)
      if (product.category && typeof product.populated === 'function' && !product.populated('category')) {
        await product.populate('category');
      }

      const payload = {
        adminProductId: product._id.toString(),
        title: product.title,
        description: product.description,
        categoryName: product.category ? product.category.name : null,
        subcategory: product.subcategory,
        pricing: {
          purchasePrice: product.pricing?.purchasePrice || 0,
          mrp: product.pricing?.mrp || 0,
          sellingPrice: product.pricing?.sellingPrice || 0,
          discountPercentage: product.pricing?.discountPercentage || 0,
        },
        inventory: {
          stockQuantity: product.inventory?.stockQuantity || 0,
        },
        variants: {
          sizes: product.variants?.sizes || [],
          colors: product.variants?.colors || [],
        },
        variantImages: product.variantImages || [],
        baseImages: product.baseImages || [],
        isActive: product.isActive,
        storeId: product.storeId,
        genderFilter: product.genderFilter || 'all',
        isTopSelling: product.isTopSelling || false,
      };

      const response = await axios.post(`${BUYER_APP_URL}/api/sync/product`, payload);
      console.log(`[Sync] Product ${product._id} synced successfully:`, response.data.success);
      return response.data;
    } catch (err) {
      console.error(`[Sync Error] Failed to sync product ${product._id}:`, err.message);
      if (err.response) {
        console.error(`[Sync Error Detail]:`, err.response.data);
      }
    }
  },

  /**
   * Sync Multiple Products to Buyer App (Bulk)
   */
  syncMultipleProducts: async (products) => {
    try {
      const results = [];
      for (const product of products) {
        const res = await syncService.syncProduct(product);
        results.push(res);
      }
      return results;
    } catch (err) {
      console.error(`[Sync Error] Bulk sync failed:`, err.message);
    }
  },

  /**
   * Sync a Category to Buyer App
   */
  syncCategory: async (category) => {
    try {
      const payload = {
        adminCategoryId: category._id.toString(),
        name: category.name,
        description: category.description || category.name,
        image: category.image,
        isActive: category.isActive,
        subcategories: category.subcategories || [],
      };

      const response = await axios.post(`${BUYER_APP_URL}/api/sync/category`, payload);
      console.log(`[Sync] Category ${category._id} synced successfully:`, response.data.success);
      return response.data;
    } catch (err) {
      console.error(`[Sync Error] Failed to sync category ${category._id}:`, err.message);
    }
  },

  /**
   * Sync a Banner to Buyer App
   */
  syncBanner: async (banner) => {
    try {
      const payload = {
        adminBannerId: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        bannerType: banner.bannerType,
        position: banner.position,
        mediaType: banner.mediaType,
        videoUrl: banner.videoUrl,
        mediaImages: banner.mediaImages,
        backgroundImage: banner.backgroundImage,
        link: banner.link,
        linkType: banner.linkType,
        linkId: banner.linkId,
        displayOrder: banner.displayOrder,
        isActive: banner.isActive,
        startDate: banner.startDate,
        endDate: banner.endDate,
        storeId: banner.storeId,
      };

      const response = await axios.post(`${BUYER_APP_URL}/api/sync/banner`, payload);
      console.log(`[Sync] Banner ${banner._id} synced successfully:`, response.data.success);
      return response.data;
    } catch (err) {
      console.error(`[Sync Error] Failed to sync banner ${banner._id}:`, err.message);
    }
  },

  /**
   * Delete Synced Product
   */
  deleteProduct: async (adminProductId) => {
    try {
      // Note: Buyer app currently doesn't have a DELETE /product/:id sync endpoint, 
      // but we could add it or just set isActive: false.
      // For now, let's assume we want to just deactivate or wait for implementation.
      console.log(`[Sync] Product delete request for ${adminProductId} (Buyer endpoint pending)`);
    } catch (err) {
      console.error(`[Sync Error] Failed to delete product ${adminProductId}:`, err.message);
    }
  },

  /**
   * Delete Synced Category
   */
  deleteCategory: async (adminCategoryId) => {
    try {
      await axios.delete(`${BUYER_APP_URL}/api/sync/category/${adminCategoryId}`);
      console.log(`[Sync] Category ${adminCategoryId} deleted from Buyer App`);
    } catch (err) {
      console.error(`[Sync Error] Failed to delete category ${adminCategoryId}:`, err.message);
    }
  },

  /**
   * Delete Synced Banner
   */
  deleteBanner: async (adminBannerId) => {
    try {
      await axios.delete(`${BUYER_APP_URL}/api/sync/banner/${adminBannerId}`);
      console.log(`[Sync] Banner ${adminBannerId} deleted from Buyer App`);
    } catch (err) {
      console.error(`[Sync Error] Failed to delete banner ${adminBannerId}:`, err.message);
    }
  },

  /**
   * Sync a Home Section to Buyer App
   */
  syncHomeSection: async (section) => {
    try {
      const payload = {
        adminSectionId: section._id.toString(),
        adminStoreId:   section.storeId,
        sectionType:    section.sectionType,
        templateType:   section.templateType,
        title:          section.title,
        displayOrder:   section.displayOrder,
        isActive:       section.isActive,
        isLocked:       section.isLocked,
        config:         section.config || {},
      };

      const response = await axios.post(`${BUYER_APP_URL}/api/sync/home-section`, payload);
      console.log(`[Sync] Home Section ${section._id} synced successfully:`, response.data.success);
      return response.data;
    } catch (err) {
      console.error(`[Sync Error] Failed to sync home section ${section._id}:`, err.message);
    }
  },

  /**
   * Delete Synced Home Section
   */
  deleteHomeSection: async (adminSectionId) => {
    try {
      await axios.delete(`${BUYER_APP_URL}/api/sync/home-section/${adminSectionId}`);
      console.log(`[Sync] Home Section ${adminSectionId} deleted from Buyer App`);
    } catch (err) {
      console.error(`[Sync Error] Failed to delete home section ${adminSectionId}:`, err.message);
    }
  }
};

module.exports = syncService;
