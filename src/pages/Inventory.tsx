import { useState } from 'react';
import { StoreSelector } from '@/components/admin/StoreSelector';
import { InventoryTable } from '@/components/admin/InventoryTable';

export default function Inventory() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products and stock levels across all stores</p>
        </div>
        <StoreSelector 
          selectedStoreId={selectedStoreId}
          onSelectStore={setSelectedStoreId}
        />
      </div>

      {/* Inventory Table */}
      <InventoryTable selectedStoreId={selectedStoreId} />
    </div>
  );
}
