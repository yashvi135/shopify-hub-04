import { useState } from 'react';
import { products, stores } from '@/data/mockData';
import { Product } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InventoryTableProps {
  selectedStoreId: string | null;
}

export function InventoryTable({ selectedStoreId }: InventoryTableProps) {
  const [productList, setProductList] = useState<Product[]>(products);

  const filteredProducts = selectedStoreId 
    ? productList.filter(p => p.storeId === selectedStoreId)
    : productList;

  const getStoreName = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || 'Unknown';
  };

  const togglePublish = (productId: string) => {
    setProductList(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, isPublished: !p.isPublished } : p
      )
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-destructive/10 text-destructive border-destructive/20' };
    if (stock < 30) return { label: 'Low Stock', className: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'In Stock', className: 'bg-success/10 text-success border-success/20' };
  };

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 animate-fade-in">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Product Inventory</h3>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products {selectedStoreId && `in ${getStoreName(selectedStoreId)}`}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <TableRow key={product.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                      {product.image}
                    </div>
                    <span className="font-medium text-card-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {product.sku}
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell className="text-muted-foreground">{getStoreName(product.storeId)}</TableCell>
                <TableCell className="font-semibold">₹{product.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.stock === 0 && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    <span className={cn(product.stock === 0 && "text-destructive font-medium")}>
                      {product.stock}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={stockStatus.className}>
                    {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={product.isPublished} 
                    onCheckedChange={() => togglePublish(product.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
