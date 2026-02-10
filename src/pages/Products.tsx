import { useState } from 'react';
import { products, categories } from '@/data/mockData';
import { Product } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Plus, Search, Package, Eye, LayoutGrid, List, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Products() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  // Add product form state
  const [form, setForm] = useState({
    name: '', categoryId: '', subcategoryId: '', description: '', fabric: '', sku: '',
    basePrice: 0, discountPercent: 0, stock: 0, sizeVariants: [] as string[], colorVariants: '' ,
  });

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

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

  const deleteProduct = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Product deleted', description: 'Product has been removed.' });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-destructive/10 text-destructive' };
    if (stock < 10) return { label: 'Low Stock', style: 'bg-warning/10 text-warning' };
    return { label: 'In Stock', style: 'bg-success/10 text-success' };
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';
  const getSubcategoryName = (catId: string, subId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.subcategories.find(s => s.id === subId)?.name || '';
  };

  const selectedCat = categories.find(c => c.id === form.categoryId);

  const handleAddProduct = () => {
    const finalPrice = form.basePrice - (form.basePrice * form.discountPercent / 100);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: form.name,
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId,
      description: form.description,
      fabric: form.fabric,
      sku: form.sku || `SG-${Date.now().toString().slice(-4)}`,
      images: ['📦'],
      basePrice: form.basePrice,
      discountPercent: form.discountPercent,
      finalPrice: Math.round(finalPrice),
      stock: form.stock,
      sizeVariants: form.sizeVariants,
      colorVariants: form.colorVariants.split(',').map(c => c.trim()).filter(Boolean),
      isPublished: true,
    };
    setProductList(prev => [newProduct, ...prev]);
    setAddOpen(false);
    setForm({ name: '', categoryId: '', subcategoryId: '', description: '', fabric: '', sku: '', basePrice: 0, discountPercent: 0, stock: 0, sizeVariants: [], colorVariants: '' });
    toast({ title: 'Product added', description: `${newProduct.name} has been added to your store.` });
  };

  const toggleSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      sizeVariants: prev.sizeVariants.includes(size) 
        ? prev.sizeVariants.filter(s => s !== size) 
        : [...prev.sizeVariants, size]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label>Product Name <span className="text-destructive">*</span></Label>
                    <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter product name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category <span className="text-destructive">*</span></Label>
                    <Select value={form.categoryId} onValueChange={v => setForm({...form, categoryId: v, subcategoryId: ''})}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subcategory</Label>
                    <Select value={form.subcategoryId} onValueChange={v => setForm({...form, subcategoryId: v})} disabled={!form.categoryId}>
                      <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                      <SelectContent>
                        {selectedCat?.subcategories.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>SKU Code</Label>
                    <Input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="Auto-generated if empty" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fabric / Material</Label>
                    <Input value={form.fabric} onChange={e => setForm({...form, fabric: e.target.value})} placeholder="e.g. Cotton, Silk" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." rows={3} />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pricing</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Base Price (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.basePrice || ''} onChange={e => setForm({...form, basePrice: Number(e.target.value)})} placeholder="0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Discount %</Label>
                    <Input type="number" value={form.discountPercent || ''} onChange={e => setForm({...form, discountPercent: Number(e.target.value)})} placeholder="0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Final Price (₹)</Label>
                    <Input value={`₹${Math.round(form.basePrice - (form.basePrice * form.discountPercent / 100))}`} readOnly className="bg-secondary" />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Inventory</h4>
                <div className="space-y-1.5 max-w-[200px]">
                  <Label>Stock Quantity <span className="text-destructive">*</span></Label>
                  <Input type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: Number(e.target.value)})} placeholder="0" />
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Variants</h4>
                <div className="space-y-1.5">
                  <Label>Size Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                          form.sizeVariants.includes(size)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Colors (comma separated)</Label>
                  <Input value={form.colorVariants} onChange={e => setForm({...form, colorVariants: e.target.value})} placeholder="Red, Blue, Green" />
                </div>
              </div>

              {/* Images placeholder */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Product Images</h4>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drop images here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 5 images, JPG/PNG, 2MB each</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={handleAddProduct} disabled={!form.name || !form.categoryId || !form.basePrice}>
                  Publish Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={!selectedCategory ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>All</Button>
              {categories.map(cat => (
                <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat.id)}>
                  {cat.name}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="modern-card p-12 text-center animate-fade-in">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first product to get started.</p>
              <Button className="gradient-primary text-primary-foreground gap-2" onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div key={product.id} className={cn("modern-card overflow-hidden group", !product.isPublished && "opacity-60")}>
                    <div className="relative h-44 bg-secondary flex items-center justify-center">
                      <span className="text-6xl">{product.images[0]}</span>
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="rounded-lg h-9 w-9"><Eye className="w-4 h-4" /></Button>
                        <Button size="icon" variant="secondary" className="rounded-lg h-9 w-9"><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="rounded-lg h-9 w-9" onClick={() => deleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <Badge variant="outline" className={cn("absolute top-2 left-2 rounded-full text-xs", stockStatus.style)}>{stockStatus.label}</Badge>
                      <Badge variant="secondary" className="absolute top-2 right-2 rounded-full font-mono text-[10px]">{product.sku}</Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{getCategoryName(product.categoryId)} › {getSubcategoryName(product.categoryId, product.subcategoryId)}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">₹{product.finalPrice.toLocaleString()}</span>
                        {product.discountPercent > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground line-through">₹{product.basePrice.toLocaleString()}</span>
                            <Badge className="text-[10px] bg-success/10 text-success border-0 rounded-full">{product.discountPercent}% off</Badge>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizeVariants.slice(0, 4).map(s => (
                          <Badge key={s} variant="outline" className="text-[10px] rounded-full px-2">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Switch checked={product.isPublished} onCheckedChange={() => togglePublish(product.id)} />
                          <span className="text-xs text-muted-foreground">{product.isPublished ? 'Active' : 'Inactive'}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{product.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="modern-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">{product.images[0]}</div>
                            <span className="font-medium text-sm">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                        <TableCell className="text-sm">{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell className="font-semibold">₹{product.finalPrice.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary" className={cn("rounded-full text-xs", stockStatus.style)}>{product.stock} - {stockStatus.label}</Badge></TableCell>
                        <TableCell><Switch checked={product.isPublished} onCheckedChange={() => togglePublish(product.id)} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
