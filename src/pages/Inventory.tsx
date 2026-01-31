import { useState } from 'react';
import { StoreSelector } from '@/components/admin/StoreSelector';
import { InventoryTable } from '@/components/admin/InventoryTable';
import { useRole } from '@/contexts/RoleContext';

export default function Inventory() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const { role } = useRole();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {role === 'SUPER_ADMIN' ? 'Inventory Management' : 'My Products'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'SUPER_ADMIN' 
              ? 'Manage products and stock levels across all boutiques'
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
      <InventoryTable selectedStoreId={selectedStoreId} />
    </div>
  );
}
