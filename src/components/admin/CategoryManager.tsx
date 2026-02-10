import { useState } from 'react';
import { categories as initialCategories } from '@/data/mockData';
import { Category } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronRight, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export function CategoryManager() {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const { toast } = useToast();

  const addCategory = () => {
    if (!newCatName) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      bannerImage: '📁',
      subcategories: [],
    };
    setCats(prev => [...prev, newCat]);
    setNewCatName('');
    setAddOpen(false);
    toast({ title: 'Category added', description: `${newCatName} has been created.` });
  };

  const deleteCategory = (id: string) => {
    setCats(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Category deleted' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories & Subcategories</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Category Name <span className="text-destructive">*</span></Label>
                <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Western Wear" />
              </div>
              <div className="space-y-1.5">
                <Label>Banner Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drop image here</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={addCategory} disabled={!newCatName}>Add Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {cats.map((cat) => (
          <div key={cat.id} className="modern-card overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.bannerImage}</span>
                <div>
                  <h3 className="font-medium text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.subcategories.length} subcategories</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => e.stopPropagation()}><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={e => { e.stopPropagation(); deleteCategory(cat.id); }}><Trash2 className="w-4 h-4" /></Button>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === cat.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {expandedId === cat.id && (
              <div className="border-t px-4 pb-3 pt-2 space-y-1 bg-secondary/20">
                {cat.subcategories.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-card transition-colors">
                    <span className="text-sm">{sub.name}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1 mt-2"><Plus className="w-3 h-3" /> Add Subcategory</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
