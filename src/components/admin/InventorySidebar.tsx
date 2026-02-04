import { useState } from 'react';
import { cn } from '@/lib/utils';
import { categories } from '@/data/mockData';
import { ChevronRight, Package, Layers, FolderOpen, Box } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type InventoryView = 'stock' | 'category' | 'subcategory' | 'products';

interface InventorySidebarProps {
  activeView: InventoryView;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onViewChange: (view: InventoryView) => void;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryId: string | null) => void;
}

export function InventorySidebar({
  activeView,
  selectedCategory,
  selectedSubcategory,
  onViewChange,
  onCategorySelect,
  onSubcategorySelect,
}: InventorySidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>('');

  const handleStockClick = () => {
    onViewChange('stock');
    onCategorySelect(null);
    onSubcategorySelect(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    onViewChange('category');
    onCategorySelect(categoryId);
    onSubcategorySelect(null);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onViewChange('subcategory');
    onCategorySelect(categoryId);
    onSubcategorySelect(subcategoryId);
  };

  const handleProductsClick = () => {
    onViewChange('products');
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Inventory</h3>
        <p className="text-xs text-muted-foreground mt-1">Manage your products</p>
      </div>

      <nav className="p-2">
        {/* Stock Overview */}
        <button
          onClick={handleStockClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            activeView === 'stock'
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <Package className="w-4 h-4" />
          Stock Overview
        </button>

        {/* All Products */}
        <button
          onClick={handleProductsClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1",
            activeView === 'products' && !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <Box className="w-4 h-4" />
          All Products
        </button>

        {/* Categories */}
        <div className="mt-4">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categories
          </div>
          
          <Accordion 
            type="single" 
            collapsible 
            value={expandedCategory}
            onValueChange={setExpandedCategory}
          >
            {categories.map((category) => (
              <AccordionItem 
                key={category.id} 
                value={category.id}
                className="border-none"
              >
                <AccordionTrigger 
                  className={cn(
                    "px-3 py-2.5 rounded-xl hover:no-underline hover:bg-secondary transition-colors",
                    selectedCategory === category.id && activeView === 'category'
                      ? "bg-secondary"
                      : ""
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category.id);
                  }}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Layers className="w-4 h-4" />
                    {category.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="ml-4 border-l border-border pl-2 space-y-1">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubcategoryClick(category.id, sub.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedSubcategory === sub.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </nav>
    </div>
  );
}
