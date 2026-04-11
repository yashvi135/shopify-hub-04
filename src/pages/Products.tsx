import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/api';
import { Product } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Plus, Search, Package, Eye, LayoutGrid, List, X, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Products() {
  const [productList, setProductList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewProduct, setViewProduct] = useState<any | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_LIMIT = 20;
  const { toast } = useToast();

  // Add product form state
  const [form, setForm] = useState({
    name: '', categoryId: '', subcategoryId: '', description: '', fabric: '', sku: '',
    purchasePrice: 0, sellingPrice: 0, mrp: 0, stock: 0,
    sizeVariants: [] as string[], colorVariants: '' as string,
    variantImages: {} as Record<string, File[]>,
  });

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

  const fetchData = useCallback(async (page = 1) => {
    try {
      const storeId = localStorage.getItem('storeId');
      const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : '';
      const productsUrl = storeId
        ? `${API_BASE_URL}/api/products?storeId=${storeId}&page=${page}&limit=${PAGE_LIMIT}${searchParam}`
        : `${API_BASE_URL}/api/products?page=${page}&limit=${PAGE_LIMIT}${searchParam}`;

      const [prodRes, catRes] = await Promise.all([
        fetch(productsUrl),
        categories.length === 0 ? fetch(`${API_BASE_URL}/api/categories`) : Promise.resolve(null),
      ]);
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProductList(prodData.data);
        setCurrentPage(prodData.page ?? 1);
        setTotalPages(prodData.totalPages ?? 1);
        setTotalCount(prodData.total ?? 0);
      }
      if (catRes) {
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use a debounced effect for both initial load and search queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchData(1);
    }, 400); // 400ms debounce for typing
    
    return () => clearTimeout(timer);
  }, [searchQuery, fetchData]);

  const filteredProducts = productList.filter(product => {
    // Server handles search, client-side filter only for category (already paginated)
    const matchesCat = !selectedCategory || product.category?._id === selectedCategory || product.category === selectedCategory;
    return matchesCat;
  });

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductList(prev => prev.filter(p => p._id !== id));
        toast({ title: 'Product deleted', description: 'Product has been removed.' });
      } else {
        const err = await res.json();
        toast({ title: 'Delete Failed', description: err.message || 'Error occurred', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', variant: 'destructive', description: 'Failed to delete product' });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setProductList(prev => prev.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
        toast({ title: !currentStatus ? 'Published to Buyer App' : 'Unpublished', description: 'Product sync status updated.' });
      } else {
        toast({ title: 'Error', description: 'Failed to update publish status', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', variant: 'destructive', description: 'Failed to update product publish status' });
    }
  };

  const openEditMode = (product: any) => {
    setEditingProductId(product._id);
    setForm({
      name: product.title,
      categoryId: typeof product.category === 'object' ? product.category._id : product.category,
      subcategoryId: product.subcategory || '',
      description: product.description || '',
      fabric: product.fabric || '',
      sku: product.sku || '',
      purchasePrice: product.pricing?.purchasePrice || 0,
      sellingPrice: product.pricing?.sellingPrice || 0,
      mrp: product.pricing?.mrp || 0,
      stock: product.inventory?.stockQuantity || 0,
      sizeVariants: product.variants?.sizes || [],
      colorVariants: (product.variants?.colors || []).join(', '),
      variantImages: {} // Existing Cloudinary images handled separately for simplicity right now
    });
    setAddOpen(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-destructive/10 text-destructive' };
    if (stock < 10) return { label: 'Low Stock', style: 'bg-warning/10 text-warning' };
    return { label: 'In Stock', style: 'bg-success/10 text-success' };
  };

  const getCategoryName = (id: string) => {
    const cid = typeof id === 'object' ? (id as any)._id : id;
    return categories.find(c => c._id === cid)?.name || '';
  };
  const getSubcategoryName = (subId: string) => subId; // subcategoryId is just the string name in db

  const selectedCat = categories.find(c => c._id === form.categoryId);

  const handleImageSelect = (color: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setForm(prev => ({
      ...prev,
      variantImages: {
        ...prev.variantImages,
        [color]: [...(prev.variantImages[color] || []), ...newFiles]
      }
    }));
  };

  const removeImage = (color: string, index: number) => {
    setForm(prev => {
      const updated = { ...prev.variantImages };
      // Revoke the blob URL to prevent memory leaks
      const fileToRemove = updated[color]?.[index];
      if (fileToRemove) {
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove));
      }
      updated[color] = updated[color].filter((_, i) => i !== index);
      return { ...prev, variantImages: updated };
    });
  };

  const handleAddProduct = async () => {
    setIsSubmitting(true);
    try {
      const discountPercent = form.mrp > 0 ? ((form.mrp - form.sellingPrice) / form.mrp) * 100 : 0;

      const submitData = new FormData();
      submitData.append('title', form.name);
      submitData.append('categoryId', form.categoryId);
      submitData.append('subcategoryId', form.subcategoryId);
      submitData.append('description', form.description);
      submitData.append('purchasePrice', form.purchasePrice.toString());
      submitData.append('sellingPrice', form.sellingPrice.toString());
      submitData.append('mrp', form.mrp.toString());
      submitData.append('discountPercentage', discountPercent.toString());
      submitData.append('stockQuantity', form.stock.toString());
      submitData.append('sizes', JSON.stringify(form.sizeVariants));
      submitData.append('colors', JSON.stringify(form.colorVariants.split(',').map(c => c.trim()).filter(Boolean)));

      // Attach storeId from localStorage
      const storeId = localStorage.getItem('storeId');
      if (storeId) submitData.append('storeId', storeId);

      // Append Images
      Object.entries(form.variantImages).forEach(([color, files]) => {
        files.forEach(file => {
          submitData.append(`variantImage_${color}`, file);
        });
      });

      const url = editingProductId
        ? `${API_BASE_URL}/api/products/${editingProductId}`
        : `${API_BASE_URL}/api/products`;

      const res = await fetch(url, {
        method: editingProductId ? 'PUT' : 'POST',
        body: submitData
      });
      const data = await res.json();

      if (data.success) {
        setAddOpen(false);
        setEditingProductId(null);
        setForm({ name: '', categoryId: '', subcategoryId: '', description: '', fabric: '', sku: '', purchasePrice: 0, sellingPrice: 0, mrp: 0, stock: 0, sizeVariants: [], colorVariants: '', variantImages: {} });
        toast({ title: editingProductId ? 'Product Updated' : 'Product added', description: `${form.name} has been successfully saved.` });
        fetchData(currentPage); // Stay on current page after edit
      } else {
        toast({ title: 'Failed to add product', description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to connect to server', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
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
        <Dialog open={addOpen} onOpenChange={(open) => {
          if (open) fetchData();
          if (!open) {
            setEditingProductId(null);
            setForm({ name: '', categoryId: '', subcategoryId: '', description: '', fabric: '', sku: '', purchasePrice: 0, sellingPrice: 0, mrp: 0, stock: 0, sizeVariants: [], colorVariants: '', variantImages: {} });
          }
          setAddOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label>Product Name <span className="text-destructive">*</span></Label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category <span className="text-destructive">*</span></Label>
                    <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v, subcategoryId: '' })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subcategory</Label>
                    <Select value={form.subcategoryId} onValueChange={v => setForm({ ...form, subcategoryId: v })} disabled={!form.categoryId}>
                      <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                      <SelectContent>
                        {selectedCat?.subcategories?.map((s: any) => {
                          const name = typeof s === 'string' ? s : s.name;
                          return <SelectItem key={name} value={name}>{name}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>SKU Code</Label>
                    <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="Auto-generated if empty" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fabric / Material</Label>
                    <Input value={form.fabric} onChange={e => setForm({ ...form, fabric: e.target.value })} placeholder="e.g. Cotton, Silk" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." rows={3} />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Purchase Price (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.purchasePrice || ''} onChange={e => setForm({ ...form, purchasePrice: Number(e.target.value) })} placeholder="Cost price" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>MRP (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.mrp || ''} onChange={e => setForm({ ...form, mrp: Number(e.target.value) })} placeholder="Maximum retail price" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Selling Price (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.sellingPrice || ''} onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })} placeholder="Your selling price" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Discount %</Label>
                    <Input value={form.mrp > 0 ? `${Math.round(((form.mrp - form.sellingPrice) / form.mrp) * 100)}%` : '0%'} readOnly className="bg-secondary" />
                  </div>
                </div>
                {form.sellingPrice > 0 && form.purchasePrice > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Margin: ₹{form.sellingPrice - form.purchasePrice} ({Math.round(((form.sellingPrice - form.purchasePrice) / form.sellingPrice) * 100)}%)
                  </p>
                )}
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Inventory</h4>
                <div className="space-y-1.5 max-w-[200px]">
                  <Label>Stock Quantity <span className="text-destructive">*</span></Label>
                  <Input type="number" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} placeholder="0" />
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
                  <Input value={form.colorVariants} onChange={e => setForm({ ...form, colorVariants: e.target.value })} placeholder="Red, Blue, Green" />
                </div>
              </div>

              {/* Variant-wise Image Upload */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Product Images (Variant-wise)</h4>
                {form.colorVariants.split(',').map(c => c.trim()).filter(Boolean).length > 0 ? (
                  <div className="space-y-4">
                    {form.colorVariants.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                      <div key={color} className="border border-border rounded-lg p-4 space-y-3">
                        <Label className="font-medium text-base flex justify-between">
                          {color} Images
                          <span className="text-xs text-muted-foreground font-normal">{(form.variantImages[color] || []).length} / 5</span>
                        </Label>

                        {(form.variantImages[color] || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {form.variantImages[color].map((f, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden group">
                                <FilePreview file={f} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => removeImage(color, idx)} className="text-white hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="relative">
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={e => handleImageSelect(color, e.target.files)}
                            disabled={(form.variantImages[color] || []).length >= 5}
                          />
                          <div className={cn(
                            "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors",
                            (form.variantImages[color] || []).length >= 5 ? "opacity-50" : "hover:border-primary/50"
                          )}>
                            <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                            <p className="text-sm text-muted-foreground">Click or drag images for <span className="font-medium text-foreground">{color}</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Add color variants above to upload images per variant</p>
                    <p className="text-xs text-muted-foreground mt-1">Or drop general images here</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={handleAddProduct} disabled={!form.name || !form.categoryId || !form.sellingPrice || isSubmitting}>
                  {isSubmitting ? 'Uploading...' : 'Publish Product'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Product Modal */}
        <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 border-none bg-background rounded-xl">
            {viewProduct && (
              <div className="flex flex-col h-full bg-background rounded-xl">
                {/* Sticky Header */}
                <DialogHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-6 py-4 border-b">
                  <div className="flex items-center gap-3 pr-8">
                    <DialogTitle className="text-2xl font-bold">{viewProduct.title}</DialogTitle>
                    <Badge variant="secondary" className="text-xs font-mono">{viewProduct.sku || 'NO SKU'}</Badge>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-8">
                  {/* Images Scroll Row */}
                  {(viewProduct.baseImages?.length > 0 || viewProduct.variantImages?.length > 0) && (
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                      {(viewProduct.baseImages || []).map((img: string, i: number) => (
                        <div key={`base-${i}`} className="relative h-44 w-44 flex-shrink-0 snap-start">
                          <img src={img} alt="Product Base" className="h-full w-full object-cover rounded-xl border border-border shadow-sm" />
                        </div>
                      ))}
                      {(viewProduct.variantImages || []).flatMap((vi: any) => vi.urls.map((url: string, i: number) => (
                        <div key={`var-${vi.color}-${i}`} className="relative h-44 w-44 flex-shrink-0 snap-start">
                          <img src={url} alt={`${vi.color} variant`} className="h-full w-full object-cover rounded-xl border border-border shadow-sm" />
                          <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-background/90 text-foreground rounded-md shadow-sm border">{vi.color}</span>
                        </div>
                      )))}
                    </div>
                  )}

                  {/* Summary Details Grid */}
                  <div className="grid grid-cols-2 gap-6 p-5 bg-secondary/30 rounded-xl border border-border">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</p>
                      <p className="font-semibold text-sm">{getCategoryName(viewProduct.category)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subcategory</p>
                      <p className="font-semibold text-sm">{viewProduct.subcategory || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fabric/Material</p>
                      <p className="font-semibold text-sm">{viewProduct.fabric || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock Left</p>
                      <p className="font-semibold text-sm">{viewProduct.inventory?.stockQuantity || 0} units</p>
                    </div>

                    <div className="col-span-2 pt-4 mt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{viewProduct.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  {/* Pricing Feature Block */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="space-y-1.5 w-full sm:w-auto mb-4 sm:mb-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Purchase Price</p>
                      <p className="font-semibold text-lg">₹{viewProduct.pricing?.purchasePrice?.toLocaleString() || 0}</p>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-border/50"></div>
                    <div className="space-y-1.5 w-full sm:w-auto mb-4 sm:mb-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Maximum Retail</p>
                      <p className="font-semibold text-lg line-through text-muted-foreground">₹{viewProduct.pricing?.mrp?.toLocaleString() || 0}</p>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-border/50"></div>
                    <div className="space-y-1.5 w-full sm:w-auto">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">Selling Price</p>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-2xl text-primary drop-shadow-sm">₹{viewProduct.pricing?.sellingPrice?.toLocaleString() || 0}</p>
                        {(viewProduct.pricing?.discountPercentage || 0) > 0 && (
                          <Badge variant="default" className="bg-success text-success-foreground hover:bg-success border-0 rounded-full font-bold px-3 py-1 shadow-sm">
                            {Math.round(viewProduct.pricing.discountPercentage)}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Configured Variants */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                      <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-4">
                        <h4 className="font-semibold text-sm tracking-wide">Sizes</h4>
                        <span className="text-xs text-muted-foreground">{(viewProduct.variants?.sizes || []).length} options</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {viewProduct.variants?.sizes?.length > 0
                          ? viewProduct.variants.sizes.map((s: string) => <Badge key={s} variant="outline" className="px-3 py-1 bg-background">{s}</Badge>)
                          : <span className="text-muted-foreground text-sm italic">None available</span>}
                      </div>
                    </div>
                    <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                      <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-4">
                        <h4 className="font-semibold text-sm tracking-wide">Colors</h4>
                        <span className="text-xs text-muted-foreground">{(viewProduct.variants?.colors || []).length} options</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {viewProduct.variants?.colors?.length > 0
                          ? viewProduct.variants.colors.map((c: string) => <Badge key={c} variant="secondary" className="px-3 py-1 capitalize border-transparent">{c}</Badge>)
                          : <span className="text-muted-foreground text-sm italic">None available</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                <Button key={cat._id} variant={selectedCategory === cat._id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat._id)}>
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
              <Button className="gradient-primary text-primary-foreground gap-2" onClick={() => {
                fetchData();
                setAddOpen(true);
              }}>
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const stock = product.inventory?.stockQuantity || 0;
                const stockStatus = getStockStatus(stock);
                const displayImage = product.variantImages?.[0]?.urls?.[0] || product.baseImages?.[0] || null;
                return (
                  <div key={product._id} className={cn("modern-card overflow-hidden group", !product.isActive && "opacity-60")}>
                    <div className="relative h-44 bg-secondary flex items-center justify-center">
                      {displayImage ? (
                        <img src={displayImage} className="w-full h-full object-cover" alt={product.title} />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="rounded-lg h-9 w-9" onClick={() => setViewProduct(product)}><Eye className="w-4 h-4" /></Button>
                        <Button size="icon" variant="secondary" className="rounded-lg h-9 w-9" onClick={() => openEditMode(product)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="rounded-lg h-9 w-9" onClick={() => deleteProduct(product._id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <Badge variant="outline" className={cn("absolute top-2 left-2 rounded-full text-xs bg-background/80 backdrop-blur-sm", stockStatus.style)}>{stockStatus.label}</Badge>
                      <div className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm px-2 py-1 shadow flex items-center gap-2 cursor-pointer transition-colors hover:bg-background/90" onClick={(e) => e.stopPropagation()}>
                         <span className="text-[10px] font-semibold">{product.isActive ? 'Published' : 'Hidden'}</span>
                         <Switch checked={product.isActive} onCheckedChange={() => togglePublish(product._id, product.isActive)} className="scale-75 data-[state=checked]:bg-green-500" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-sm truncate">{product.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{getCategoryName(product.category)} › {getSubcategoryName(product.subcategory)}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">₹{product.pricing?.sellingPrice?.toLocaleString() || 0}</span>
                        {(product.pricing?.discountPercentage || 0) > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground line-through">₹{product.pricing?.mrp?.toLocaleString() || 0}</span>
                            <Badge className="text-[10px] bg-green-500/10 text-green-500 border-0 rounded-full">{Math.round(product.pricing.discountPercentage)}% off</Badge>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(product.variants?.sizes || []).slice(0, 4).map((s: string) => (
                          <Badge key={s} variant="outline" className="text-[10px] rounded-full px-2">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs font-medium text-muted-foreground">{stock} in stock</span>
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
                    const stock = product.inventory?.stockQuantity || 0;
                    const stockStatus = getStockStatus(stock);
                    const displayImage = product.variantImages?.[0]?.urls?.[0] || product.baseImages?.[0] || null;
                    return (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                              {displayImage ? <img src={displayImage} className="w-full h-full object-cover" /> : '📦'}
                            </div>
                            <span className="font-medium text-sm">{product.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{product._id.slice(-6)}</TableCell>
                        <TableCell className="text-sm">{getCategoryName(product.category)}</TableCell>
                        <TableCell className="font-semibold">₹{product.pricing?.sellingPrice?.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary" className={cn("rounded-full text-xs", stockStatus.style)}>{stock} - {stockStatus.label}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                             <Switch checked={product.isActive} onCheckedChange={() => togglePublish(product._id, product.isActive)} className="scale-90 data-[state=checked]:bg-green-500" />
                             <span className="text-xs font-medium text-muted-foreground">{product.isActive ? 'Published' : 'Hidden'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground" onClick={() => setViewProduct(product)}><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground" onClick={() => openEditMode(product)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProduct(product._id)}><Trash2 className="w-4 h-4" /></Button>
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

        {/* ─── Pagination Controls ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_LIMIT + 1}–{Math.min(currentPage * PAGE_LIMIT, totalCount)} of {totalCount} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                disabled={currentPage <= 1}
                onClick={() => { const p = currentPage - 1; setCurrentPage(p); fetchData(p); }}
              >
                ← Prev
              </Button>
              <span className="text-sm font-medium px-2">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => { const p = currentPage + 1; setCurrentPage(p); fetchData(p); }}
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="categories" className="mt-4">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── FilePreview component — creates & revokes blob URLs safely ──────────────
function FilePreview({ file, className }: { file: File; className?: string }) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url); // cleanup on unmount or file change
  }, [file]);

  if (!src) return null;
  return <img src={src} className={className} alt="Preview" />;
}
