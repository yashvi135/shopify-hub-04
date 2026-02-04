import { useState } from 'react';
import { StoreSelector } from '@/components/admin/StoreSelector';
import { InventoryTable } from '@/components/admin/InventoryTable';
import { InventorySidebar, InventoryView } from '@/components/admin/InventorySidebar';
import { useRole } from '@/contexts/RoleContext';

export default function Inventory() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<InventoryView>('stock');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { role } = useRole();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Inventory Sidebar */}
      <InventorySidebar
        activeView={activeView}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onViewChange={setActiveView}
        onCategorySelect={setSelectedCategory}
        onSubcategorySelect={setSelectedSubcategory}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {role === 'SUPER_ADMIN' ? 'Inventory Management' : 'My Products'}
            </h1>
            <p className="text-muted-foreground">
              {role === 'SUPER_ADMIN' 
                ? 'Manage products and stock levels across all stores'
                : 'Manage your product collection'
              }
            </p>
          </div>
          {role === 'SUPER_ADMIN' && (
            <StoreSelector 
              selectedStoreId={selectedStoreId}
              onSelectStore={setSelectedStoreId}
            />
          )}
        </div>

        {/* Inventory Table */}
        <InventoryTable 
          selectedStoreId={selectedStoreId}
          activeView={activeView}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
        />
      </div>
    </div>
  );
}
