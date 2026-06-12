import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────

// Mock API base URL
vi.mock('@/api', () => ({ API_BASE_URL: 'http://localhost:5000' }));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock CategoryManager (not under test)
vi.mock('@/components/admin/CategoryManager', () => ({
  CategoryManager: () => <div data-testid="category-manager">Category Manager</div>,
}));

// ── Shared fetch mock helpers ─────────────────────────────────────────────

const PRODUCTS_UNDER_999 = [
  {
    _id: 'prod_a1b2c3',
    title: 'Budget Kurta',
    pricing: { sellingPrice: 499, mrp: 599, discountPercentage: 17 },
    inventory: { stockQuantity: 50 },
    ratings: { average: 4.2, count: 12 },
    isUnder999: true,
    isActive: true,
    variantImages: [],
    baseImages: [],
    variants: { sizes: ['M', 'L'], colors: ['Blue'] },
    categoryId: { _id: 'cat1', name: 'Kurtas' },
  },
  {
    _id: 'prod_x9y8z7',
    title: 'Cheap Tshirt',
    pricing: { sellingPrice: 299, mrp: 399, discountPercentage: 25 },
    inventory: { stockQuantity: 20 },
    ratings: { average: 0, count: 0 },
    isUnder999: true,
    isActive: true,
    variantImages: [],
    baseImages: [],
    variants: { sizes: ['S', 'M'], colors: ['White'] },
    categoryId: { _id: 'cat2', name: 'Tops' },
  },
];

const EMPTY_PRODUCTS_RESPONSE = {
  success: true,
  data: [],
  pagination: { total: 0, page: 1, totalPages: 1 },
};

const CATEGORIES_RESPONSE = {
  success: true,
  data: [
    { _id: 'cat1', name: 'Kurtas', subcategories: [] },
    { _id: 'cat2', name: 'Tops', subcategories: [] },
  ],
};

// Build a fetch mock that routes URLs to the right response
function buildFetchMock(under999Products = PRODUCTS_UNDER_999) {
  return vi.fn().mockImplementation((url: string) => {
    if (url.includes('/api/products/under-999')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: under999Products }),
      });
    }
    if (url.includes('/api/categories')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(CATEGORIES_RESPONSE),
      });
    }
    // Default: product list (paginated)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(EMPTY_PRODUCTS_RESPONSE),
    });
  });
}

// ── Lazy import Products after mocks are set up ────────────────────────────
// We do this inside each test to get a fresh module with the mocked fetch.
async function renderProducts() {
  const { default: Products } = await import('@/pages/Products');
  return render(<Products />);
}

// ─────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────

describe('Products page — Under ₹999 feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem('storeId', 'store123');
    global.fetch = buildFetchMock();
  });

  // ── Tab existence ────────────────────────────────────────────────────────

  describe('Under ₹999 Tab', () => {
    it('renders the "Under ₹999" tab in the tab list', async () => {
      await renderProducts();
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /under ₹999/i })).toBeInTheDocument();
      });
    });

    it('shows a count badge on the tab when products are loaded', async () => {
      await renderProducts();

      // Click the Under ₹999 tab to trigger the fetch
      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        // Badge with count "2" should be visible
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  // ── Tab content ─────────────────────────────────────────────────────────

  describe('Under ₹999 tab content', () => {
    it('shows empty state when no products are tagged', async () => {
      global.fetch = buildFetchMock([]); // no under-999 products
      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        expect(screen.getByText(/no products tagged yet/i)).toBeInTheDocument();
      });
    });

    it('displays tagged products in the table with name and price', async () => {
      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        expect(screen.getByText('Budget Kurta')).toBeInTheDocument();
        expect(screen.getByText('Cheap Tshirt')).toBeInTheDocument();
      });

      // Prices should be displayed
      expect(screen.getByText('₹499')).toBeInTheDocument();
      expect(screen.getByText('₹299')).toBeInTheDocument();
    });

    it('shows ratings for products that have them', async () => {
      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        // Budget Kurta has rating 4.2
        expect(screen.getByText(/4\.2/)).toBeInTheDocument();
        // Cheap Tshirt has no ratings
        expect(screen.getByText(/no ratings/i)).toBeInTheDocument();
      });
    });

    it('shows stock counts', async () => {
      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        expect(screen.getByText('50 units')).toBeInTheDocument();
        expect(screen.getByText('20 units')).toBeInTheDocument();
      });
    });

    it('calls GET /api/products/under-999 when tab is activated', async () => {
      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => {
        const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
        const under999Call = calls.find(([url]: [string]) =>
          url.includes('/api/products/under-999')
        );
        expect(under999Call).toBeDefined();
      });
    });
  });

  // ── Remove tag ───────────────────────────────────────────────────────────

  describe('Remove tag button', () => {
    it('calls PUT /api/products/:id with { isUnder999: false } when Remove is clicked', async () => {
      // Mock the PUT response for remove
      global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
        if (url.includes('/api/products/under-999')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: PRODUCTS_UNDER_999 }),
          });
        }
        if (url.includes('/api/products/prod_a1b2c3') && options?.method === 'PUT') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { isUnder999: false } }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(EMPTY_PRODUCTS_RESPONSE),
        });
      });

      await renderProducts();

      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      // Wait for products to appear
      await waitFor(() => {
        expect(screen.getByText('Budget Kurta')).toBeInTheDocument();
      });

      // Click the first "Remove" button
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await userEvent.click(removeButtons[0]);

      await waitFor(() => {
        const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
        const putCall = calls.find(([url, opts]: [string, RequestInit]) =>
          url.includes('/api/products/prod_a1b2c3') && opts?.method === 'PUT'
        );
        expect(putCall).toBeDefined();
        const body = JSON.parse(putCall[1].body as string);
        expect(body).toEqual({ isUnder999: false });
      });
    });

    it('removes product from the tab list after successful untag', async () => {
      global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
        if (url.includes('/api/products/under-999')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: PRODUCTS_UNDER_999 }),
          });
        }
        if (url.includes('/api/products/') && options?.method === 'PUT') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(EMPTY_PRODUCTS_RESPONSE),
        });
      });

      await renderProducts();
      const tab = await screen.findByRole('tab', { name: /under ₹999/i });
      await userEvent.click(tab);

      await waitFor(() => screen.getByText('Budget Kurta'));

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await userEvent.click(removeButtons[0]);

      // Budget Kurta should be removed from the list
      await waitFor(() => {
        expect(screen.queryByText('Budget Kurta')).not.toBeInTheDocument();
        // Cheap Tshirt should still be present
        expect(screen.getByText('Cheap Tshirt')).toBeInTheDocument();
      });
    });
  });

  // ── isUnder999 toggle in Add/Edit form ───────────────────────────────────

  describe('Under ₹999 toggle in product form', () => {
    // Helper: finds the header-level "Add Product" dialog trigger
    // (not the one inside the empty-products state card)
    async function openAddDialog() {
      const buttons = await screen.findAllByRole('button', { name: /add product/i });
      // The dialog trigger has aria-haspopup="dialog"
      const triggerBtn = buttons.find(
        (b) => b.getAttribute('aria-haspopup') === 'dialog'
      ) ?? buttons[0];
      await userEvent.click(triggerBtn);
    }

    it('renders the Under ₹999 switch in the add product dialog', async () => {
      await renderProducts();
      await openAddDialog();

      await waitFor(() => {
        expect(screen.getByText(/under ₹999 collection/i)).toBeInTheDocument();
      });
    });

    it('disables the Under ₹999 switch when selling price is >= 999', async () => {
      await renderProducts();
      await openAddDialog();

      // Enter a price >= 999
      const sellingPriceInput = await screen.findByPlaceholderText(/your selling price/i);
      await userEvent.clear(sellingPriceInput);
      await userEvent.type(sellingPriceInput, '1200');

      await waitFor(() => {
        // Inside the dialog there are two Switch components: Top Selling (index 0), Under ₹999 (index 1)
        const switches = screen.getAllByRole('switch');
        const under999Switch = switches[switches.length - 1]; // Under ₹999 is always the last switch in the dialog
        expect(under999Switch).toBeDisabled();
      });
    });

    it('enables the Under ₹999 switch when selling price is < 999', async () => {
      await renderProducts();
      await openAddDialog();

      const sellingPriceInput = await screen.findByPlaceholderText(/your selling price/i);
      await userEvent.clear(sellingPriceInput);
      await userEvent.type(sellingPriceInput, '499');

      await waitFor(() => {
        const switches = screen.getAllByRole('switch');
        const under999Switch = switches[switches.length - 1];
        expect(under999Switch).not.toBeDisabled();
      });
    });

    it('sends isUnder999=true in FormData when toggle is on and product is saved', async () => {
      global.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
        if (url.includes('/api/categories')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(CATEGORIES_RESPONSE),
          });
        }
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { _id: 'newprod', title: 'Test Product' } }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(EMPTY_PRODUCTS_RESPONSE),
        });
      });

      await renderProducts();
      await openAddDialog();

      // Fill in required fields
      const nameInput = await screen.findByPlaceholderText(/enter product name/i);
      await userEvent.type(nameInput, 'Test Product');

      const sellingInput = await screen.findByPlaceholderText(/your selling price/i);
      await userEvent.clear(sellingInput);
      await userEvent.type(sellingInput, '599');

      // Toggle on Under ₹999 — it's the last switch in the dialog
      await waitFor(() => {
        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBeGreaterThan(0);
      });
      const under999Switch = screen.getAllByRole('switch').at(-1)!;
      await userEvent.click(under999Switch);

      // Click Publish
      const publishBtn = await screen.findByRole('button', { name: /publish product/i });
      await userEvent.click(publishBtn);

      await waitFor(() => {
        const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
        const postCall = calls.find(([, opts]: [string, RequestInit]) => opts?.method === 'POST');
        expect(postCall).toBeDefined();
        const formData = postCall[1].body as FormData;
        expect(formData.get('isUnder999')).toBe('true');
      });
    });
  });
});
