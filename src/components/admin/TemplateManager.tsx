import { useState } from 'react';
import { homePageRows } from '@/data/mockData';
import { HomePageRow, HomePageRowType } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
  GripVertical, 
  Image, 
  TrendingUp, 
  CircleDot, 
  Building2, 
  Eye, 
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2
} from 'lucide-react';

const rowTypeConfig: Record<HomePageRowType, { icon: typeof Image; label: string; description: string; color: string }> = {
  hero_banner: { 
    icon: Image, 
    label: 'Hero Banner', 
    description: 'Large promotional banner at the top',
    color: 'bg-primary/10 text-primary border-primary/30'
  },
  top_selling: { 
    icon: TrendingUp, 
    label: 'Top Selling', 
    description: 'Horizontal scroller of best-selling products',
    color: 'bg-success/10 text-success border-success/30'
  },
  category_circles: { 
    icon: CircleDot, 
    label: 'Category Circles', 
    description: 'Circular category icons (Saree, Ethnic, Dress)',
    color: 'bg-secondary text-foreground border-border'
  },
  sponsored_brands: { 
    icon: Building2, 
    label: 'Sponsored Brands', 
    description: 'Featured store showcase section',
    color: 'bg-muted text-muted-foreground border-muted-foreground/30'
  },
};

export function TemplateManager() {
  const [rows, setRows] = useState<HomePageRow[]>(homePageRows);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setRows(prev => prev.map(row => 
      row.id === id ? { ...row, isVisible: !row.isVisible } : row
    ));
  };

  const moveRow = (id: string, direction: 'up' | 'down') => {
    const currentIndex = rows.findIndex(r => r.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === rows.length - 1)
    ) return;

    const newRows = [...rows];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newRows[currentIndex], newRows[targetIndex]] = [newRows[targetIndex], newRows[currentIndex]];
    
    // Update order numbers
    newRows.forEach((row, idx) => {
      row.order = idx + 1;
    });
    
    setRows(newRows);
  };

  const deleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = rows.findIndex(r => r.id === draggedId);
    const targetIndex = rows.findIndex(r => r.id === targetId);

    const newRows = [...rows];
    const [draggedRow] = newRows.splice(draggedIndex, 1);
    newRows.splice(targetIndex, 0, draggedRow);
    
    newRows.forEach((row, idx) => {
      row.order = idx + 1;
    });
    
    setRows(newRows);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Home Page Configurator</h1>
          <p className="text-muted-foreground">Drag and drop to rearrange the buyer app home page</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button className="gap-2 rounded-2xl">
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Phone Preview Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-4">Layout Rows</h3>
          {rows.map((row, index) => {
            const config = rowTypeConfig[row.type];
            const Icon = config.icon;
            
            return (
              <div
                key={row.id}
                draggable
                onDragStart={() => handleDragStart(row.id)}
                onDragOver={(e) => handleDragOver(e, row.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "modern-card p-4 cursor-move transition-all duration-200",
                  draggedId === row.id && "opacity-50 scale-[0.98]",
                  !row.isVisible && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => moveRow(row.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => moveRow(row.id, 'down')}
                      disabled={index === rows.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{config.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{config.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={row.isVisible}
                      onCheckedChange={() => toggleVisibility(row.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteRow(row.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview */}
        <div className="flex justify-center">
          <div className="w-[320px] bg-foreground rounded-[3rem] p-3 shadow-elevated">
            <div className="bg-background rounded-[2.5rem] h-[640px] overflow-hidden relative">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-2xl z-10" />
              
              {/* Preview Content */}
              <div className="pt-10 pb-4 px-3 h-full overflow-y-auto space-y-3">
                {rows.filter(r => r.isVisible).map((row) => {
                  if (row.type === 'hero_banner') {
                    return (
                      <div key={row.id} className="h-40 rounded-xl bg-gradient-to-r from-primary to-muted-foreground flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">Hero Banner</span>
                      </div>
                    );
                  }
                  
                  if (row.type === 'category_circles') {
                    return (
                      <div key={row.id} className="py-3">
                        <p className="text-xs font-medium mb-2 px-1">Shop by Category</p>
                        <div className="flex justify-around">
                          {['🥻', '👗', '👘', '🧣'].map((emoji, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg">
                                {emoji}
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {['Saree', 'Dress', 'Ethnic', 'Acc'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (row.type === 'top_selling') {
                    return (
                      <div key={row.id} className="py-3">
                        <p className="text-xs font-medium mb-2 px-1">Top Selling</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-shrink-0 w-24 rounded-lg bg-secondary p-2">
                              <div className="w-full h-20 bg-muted rounded-md mb-1 flex items-center justify-center text-2xl">
                                🥻
                              </div>
                              <p className="text-[10px] truncate">Silk Saree</p>
                              <p className="text-[10px] font-bold">₹4,999</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (row.type === 'sponsored_brands') {
                    return (
                      <div key={row.id} className="py-3">
                        <p className="text-xs font-medium mb-2 px-1">Featured Stores</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="rounded-lg bg-secondary p-3 text-center">
                              <div className="w-10 h-10 rounded-full bg-primary mx-auto mb-1 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <p className="text-[10px] font-medium">Store {i}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
