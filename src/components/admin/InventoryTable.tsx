import { useState } from 'react';
import { products, stores, categories } from '@/data/mockData';
import { Product } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Plus, Search, Filter, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRole } from '@/contexts/RoleContext';
import { InventoryView } from './InventorySidebar';

interface InventoryTableProps {
  selectedStoreId: string | null;
  activeView: InventoryView;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
}

export function InventoryTable({ 
  selectedStoreId, 
  activeView,
  selectedCategory,
  selectedSubcategory 
}: InventoryTableProps) {
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const { role, currentStoreId } = useRole();

  // For store owners, always filter to their store
  const effectiveStoreId = role === 'STORE_OWNER' ? currentStoreId : selectedStoreId;
  
  // Get category/subcategory names for filtering
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };
  
  const getSubcategoryName = (subcategoryId: string) => {
    for (const cat of categories) {
      const sub = cat.subcategories.find(s => s.id === subcategoryId);
      if (sub) return sub.name;
    }
    return '';
  };

  const filteredProducts = productList.filter(product => {
    const matchesStore = !effectiveStoreId || product.storeId === effectiveStoreId;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category/subcategory based on view
    let matchesCategory = true;
    if (selectedCategory && activeView === 'category') {
      const categoryName = getCategoryName(selectedCategory);
      matchesCategory = product.category.toLowerCase().includes(categoryName.toLowerCase());
    }
    if (selectedSubcategory && activeView === 'subcategory') {
      const subcategoryName = getSubcategoryName(selectedSubcategory);
      matchesCategory = product.category.toLowerCase().includes(subcategoryName.split(' ')[0].toLowerCase());
    }
    
    return matchesStore && matchesSearch && matchesCategory;
  });

  const togglePublish = (productId: string) => {
    setProductList(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, isPublished: !p.isPublished } : p
      )
    );
  };

  // Get current store info for store owner
  const currentStore = stores.find(s => s.id === effectiveStoreId);
  const storeProductCount = currentStore ? productList.filter(p => p.storeId === currentStore.id).length : 0;
  const productLimitPercent = currentStore ? (storeProductCount / currentStore.productLimit) * 100 : 0;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-destructive/10 text-destructive border-destructive/20' };
    if (stock < 10) return { label: 'Low Stock', style: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'In Stock', style: 'bg-success/10 text-success border-success/20' };
  };

  // Get view title
  const getViewTitle = () => {
    if (activeView === 'stock') return 'Stock Overview';
    if (activeView === 'products') return 'All Products';
    if (activeView === 'category' && selectedCategory) {
      return getCategoryName(selectedCategory);
    }
    if (activeView === 'subcategory' && selectedSubcategory) {
      return getSubcategoryName(selectedSubcategory);
    }
    return 'Products';
  };

  // Stock Overview View
  if (activeView === 'stock') {
    const totalStock = productList.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = productList.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockCount = productList.filter(p => p.stock === 0).length;
    const inStockCount = productList.filter(p => p.stock >= 10).length;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="modern-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Stock</span>
            </div>
            <p className="text-2xl font-bold">{totalStock} units</p>
          </div>
          
          <div className="modern-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">In Stock</span>
            </div>
            <p className="text-2xl font-bold text-success">{inStockCount} products</p>
          </div>
          
          <div className="modern-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-warning">{lowStockCount} products</p>
          </div>
          
          <div className="modern-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{outOfStockCount} products</p>
          </div>
        </div>

        {/* Category-wise stock breakdown */}
        <div className="modern-card p-6">
          <h3 className="font-semibold text-lg mb-4">Stock by Category</h3>
          <div className="space-y-4">
            {categories.map((cat) => {
              const catProducts = productList.filter(p => 
                p.category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])
              );
              const catStock = catProducts.reduce((acc, p) => acc + p.stock, 0);
              const percentage = totalStock > 0 ? (catStock / totalStock) * 100 : 0;
              
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{catStock} units ({catProducts.length} products)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (filteredProducts.length === 0 && !searchQuery) {
    return (
      <div className="modern-card p-12 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Your store is waiting for its first masterpiece! ✨
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your collection by adding your first product. Each piece tells a story of elegance and craftsmanship.
        </p>
        <Button className="rounded-2xl gap-2">
          <Plus className="w-4 h-4" />
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
        <Badge variant="secondary" className="rounded-full">
          {filteredProducts.length} products
        </Badge>
      </div>

      {/* Product Limit Progress - Show for Store Owners */}
      {(role === 'STORE_OWNER' || effectiveStoreId) && currentStore && (
        <div className="modern-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold">Product Upload Limit</h4>
              <p className="text-sm text-muted-foreground">
                {storeProductCount} of {currentStore.productLimit} products uploaded
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "rounded-full",
                productLimitPercent >= 90 
                  ? "bg-destructive/10 text-destructive" 
                  : productLimitPercent >= 70 
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
              )}
            >
              {currentStore.productLimit - storeProductCount} remaining
            </Badge>
          </div>
          <Progress value={productLimitPercent} className="h-3" />
        </div>
      )}

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl bg-secondary/50 border-0"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 rounded-2xl">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          const store = stores.find(s => s.id === product.storeId);
          
          return (
            <div 
              key={product.id}
              className={cn(
                "modern-card overflow-hidden group",
                !product.isPublished && "opacity-70"
              )}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <span className="text-7xl">{product.image}</span>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="rounded-full h-10 w-10">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="rounded-full h-10 w-10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stock Badge */}
                <Badge 
                  variant="outline" 
                  className={cn("absolute top-3 left-3 rounded-full", stockStatus.style)}
                >
                  {stockStatus.label}
                </Badge>

                {/* SKU */}
                <Badge variant="secondary" className="absolute top-3 right-3 rounded-full font-mono text-xs">
                  {product.sku}
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-bold text-lg whitespace-nowrap">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>

                {role === 'SUPER_ADMIN' && store && (
                  <p className="text-xs text-muted-foreground mb-3 truncate">
                    📍 {store.name}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Published</span>
                    <Switch
                      checked={product.isPublished}
                      onCheckedChange={() => togglePublish(product.id)}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {product.stock} units
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
