import { useState } from 'react';
import { products, categories } from '@/data/mockData';
import { Product } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Plus, Search, Package, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager } from '@/components/admin/CategoryManager';

export default function Products() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = productList.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const togglePublish = (id: string) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-destructive/10 text-destructive border-destructive/20' };
    if (stock < 10) return { label: 'Low Stock', style: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'In Stock', style: 'bg-success/10 text-success border-success/20' };
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';
  const getSubcategoryName = (catId: string, subId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.subcategories.find(s => s.id === subId)?.name || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your inventory</p>
        </div>
        <Button className="gap-2 rounded-2xl gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="products" className="rounded-xl">Products</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 mt-6">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl bg-secondary/50 border-0"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                className="rounded-2xl"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-2xl"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="modern-card p-12 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Your store is waiting for its first masterpiece! ✨
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your collection by adding your first product.
              </p>
              <Button className="rounded-2xl gap-2 gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div key={product.id} className={cn("modern-card overflow-hidden group", !product.isPublished && "opacity-70")}>
                    <div className="relative h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <span className="text-7xl">{product.images[0]}</span>
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10"><Eye className="w-4 h-4" /></Button>
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10"><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="rounded-full h-10 w-10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <Badge variant="outline" className={cn("absolute top-3 left-3 rounded-full", stockStatus.style)}>{stockStatus.label}</Badge>
                      <Badge variant="secondary" className="absolute top-3 right-3 rounded-full font-mono text-xs">{product.sku}</Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate text-sm">{product.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{getCategoryName(product.categoryId)} › {getSubcategoryName(product.categoryId, product.subcategoryId)}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">₹{product.finalPrice.toLocaleString()}</span>
                        {product.discountPercent > 0 && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">₹{product.basePrice.toLocaleString()}</span>
                            <Badge className="rounded-full text-xs bg-success/10 text-success border-0">{product.discountPercent}% off</Badge>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizeVariants.map(s => (
                          <Badge key={s} variant="outline" className="text-xs rounded-full">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Published</span>
                          <Switch checked={product.isPublished} onCheckedChange={() => togglePublish(product.id)} />
                        </div>
                        <span className="text-sm font-medium">{product.stock} units</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
