import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, ChevronRight, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export function CategoryManager() {
  const [cats, setCats] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  const [addingSubToCat, setAddingSubToCat] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      if (data.success) setCats(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCatName) return;
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCatName, subcategories: [] })
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => [...prev, data.data]);
        setNewCatName('');
        setAddOpen(false);
        toast({ title: 'Category added', description: `${newCatName} has been created.` });
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add category', variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to completely delete this entire category?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCats(prev => prev.filter(c => c._id !== id));
        toast({ title: 'Category deleted', description: 'Category and all subcategories removed.' });
      } else {
        const err = await res.json();
        toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const updateCategory = async () => {
    if (!editCatName || !editCatId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${editCatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCatName })
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => prev.map(c => c._id === editCatId ? data.data : c));
        setEditCatId(null);
        setEditCatName('');
        toast({ title: 'Category updated', description: 'Changes saved successfully.' });
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' });
    }
  };

  const addSubcategory = async (cat: any) => {
    if (!newSubName.trim()) return;
    try {
      const updatedSubs = [...(cat.subcategories || []), newSubName.trim()];
      const res = await fetch(`http://localhost:5000/api/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategories: updatedSubs })
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => prev.map(c => c._id === cat._id ? data.data : c));
        setNewSubName('');
        setAddingSubToCat(null);
        toast({ title: 'Subcategory added' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add subcategory', variant: 'destructive' });
    }
  };

  const removeSubcategory = async (cat: any, subName: string) => {
    try {
      const updatedSubs = (cat.subcategories || []).filter((s: string) => s !== subName);
      const res = await fetch(`http://localhost:5000/api/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategories: updatedSubs })
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => prev.map(c => c._id === cat._id ? data.data : c));
        toast({ title: 'Subcategory deleted' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete subcategory', variant: 'destructive' });
    }
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

        {/* Edit Category Modal */}
        <Dialog open={!!editCatId} onOpenChange={(open) => {
          if (!open) { setEditCatId(null); setEditCatName(''); }
        }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Category Name <span className="text-destructive">*</span></Label>
                <Input value={editCatName} onChange={e => setEditCatName(e.target.value)} placeholder="e.g. Western Wear" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setEditCatId(null); setEditCatName(''); }}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={updateCategory} disabled={!editCatName}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      <div className="space-y-2">
        {cats.map((cat) => (
          <div key={cat._id} className="modern-card overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setExpandedId(expandedId === cat._id ? null : cat._id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <h3 className="font-medium text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{(cat.subcategories || []).length} subcategories</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => { e.stopPropagation(); setEditCatId(cat._id); setEditCatName(cat.name); }}><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={e => { e.stopPropagation(); deleteCategory(cat._id); }}><Trash2 className="w-4 h-4" /></Button>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === cat._id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {expandedId === cat._id && (
              <div className="border-t px-4 pb-3 pt-2 space-y-1 bg-secondary/20">
                {(cat.subcategories || []).map((sub: string, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-card transition-colors">
                    <span className="text-sm">{sub}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeSubcategory(cat, sub)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}

                {addingSubToCat === cat._id ? (
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <Input
                      size="sm"
                      className="h-8 text-sm"
                      autoFocus
                      placeholder="New subcategory name..."
                      value={newSubName}
                      onChange={e => setNewSubName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addSubcategory(cat); }}
                    />
                    <Button size="sm" onClick={() => addSubcategory(cat)}>Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingSubToCat(null); setNewSubName(''); }}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1 mt-2" onClick={() => setAddingSubToCat(cat._id)}>
                    <Plus className="w-3 h-3" /> Add Subcategory
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div >
  );
}
