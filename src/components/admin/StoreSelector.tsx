import { useState } from 'react';
import { Store, ChevronDown, Check } from 'lucide-react';
import { stores } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface StoreSelectorProps {
  selectedStoreId: string | null;
  onSelectStore: (storeId: string | null) => void;
}

export function StoreSelector({ selectedStoreId, onSelectStore }: StoreSelectorProps) {
  const selectedStore = stores.find(s => s.id === selectedStoreId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span>{selectedStore?.name || 'All Stores'}</span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        <DropdownMenuItem 
          onClick={() => onSelectStore(null)}
          className="flex items-center justify-between"
        >
          <span>All Stores</span>
          {selectedStoreId === null && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => onSelectStore(store.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                store.isActive ? "bg-success" : "bg-muted-foreground"
              )} />
              <span>{store.name}</span>
            </div>
            {selectedStoreId === store.id && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
