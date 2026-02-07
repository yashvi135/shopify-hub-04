import { useState } from 'react';
import { categories as initialCategories } from '@/data/mockData';
import { Category } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';

export function CategoryManager() {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories & Subcategories</h2>
        <Button className="gap-2 rounded-2xl gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="space-y-3">
        {cats.map((cat) => (
          <div key={cat.id} className="modern-card overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.bannerImage}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.subcategories.length} subcategories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-destructive" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === cat.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {expandedId === cat.id && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-2 bg-secondary/20">
                {cat.subcategories.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-background transition-colors">
                    <span className="text-sm font-medium">{sub.name}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="rounded-full h-7 w-7"><Edit className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="rounded-full h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1 rounded-xl mt-2">
                  <Plus className="w-3 h-3" />
                  Add Subcategory
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
