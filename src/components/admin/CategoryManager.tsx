import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, ChevronRight, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { API_BASE_URL } from '@/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export function CategoryManager() {
  const [cats, setCats] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [addOpen, setAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState<File | null>(null);

  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatImage, setEditCatImage] = useState<File | null>(null);

  const [addingSubToCat, setAddingSubToCat] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState<File | null>(null);
  
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
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
      const formData = new FormData();
      formData.append('name', newCatName);
      if (newCatImage) {
        formData.append('image', newCatImage);
      }
      
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => [...prev, data.data]);
        setNewCatName('');
        setNewCatImage(null);
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
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
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
      const formData = new FormData();
      formData.append('name', editCatName);
      if (editCatImage) {
        formData.append('image', editCatImage);
      }
        
      const res = await fetch(`${API_BASE_URL}/api/categories/${editCatId}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => prev.map(c => c._id === editCatId ? data.data : c));
        setEditCatId(null);
        setEditCatName('');
        setEditCatImage(null);
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
      const formData = new FormData();
      formData.append('name', newSubName.trim());
      if (newSubImage) {
         formData.append('image', newSubImage);
      }
      
      const res = await fetch(`${API_BASE_URL}/api/categories/${cat._id}/subcategories`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCats(prev => prev.map(c => c._id === cat._id ? data.data : c));
        setNewSubName('');
        setNewSubImage(null);
        setAddingSubToCat(null);
        toast({ title: 'Subcategory added' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add subcategory', variant: 'destructive' });
    }
  };

  const removeSubcategory = async (cat: any, sub: any) => {
    try {
      const subIdentifier = sub._id || sub.name || sub; // fallback for legacy data
      const res = await fetch(`${API_BASE_URL}/api/categories/${cat._id}/subcategories/${subIdentifier}`, {
        method: 'DELETE',
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
        <Dialog open={addOpen} onOpenChange={(open) => {
           setAddOpen(open);
           if(!open){ setNewCatName(''); setNewCatImage(null); }
        }}>
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
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={e => e.target.files && setNewCatImage(e.target.files[0])}
                  />
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    {newCatImage ? (
                      <div>
                        <img src={URL.createObjectURL(newCatImage)} alt="Preview" className="h-20 mx-auto object-cover rounded-md mb-2" />
                        <p className="text-xs text-muted-foreground">{newCatImage.name}</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click or drag image here</p>
                      </>
                    )}
                  </div>
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
          if (!open) { setEditCatId(null); setEditCatName(''); setEditCatImage(null); }
        }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Category Name <span className="text-destructive">*</span></Label>
                <Input value={editCatName} onChange={e => setEditCatName(e.target.value)} placeholder="e.g. Western Wear" />
              </div>
              <div className="space-y-1.5">
                <Label>Update Banner Image</Label>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={e => e.target.files && setEditCatImage(e.target.files[0])}
                  />
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    {editCatImage ? (
                       <div>
                         <img src={URL.createObjectURL(editCatImage)} alt="Preview" className="h-20 mx-auto object-cover rounded-md mb-2" />
                         <p className="text-xs text-muted-foreground">{editCatImage.name}</p>
                       </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload new image (optional)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setEditCatId(null); setEditCatName(''); setEditCatImage(null); }}>Cancel</Button>
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border border-border">
                   {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground opacity-50" />}
                </div>
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
                {(cat.subcategories || []).map((sub: any, index: number) => {
                  const subName = typeof sub === 'string' ? sub : sub.name;
                  const subImage = typeof sub === 'object' && sub !== null ? sub.image : null;
                  return (
                    <div key={sub._id || index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-card transition-colors">
                      <div className="flex items-center gap-3">
                        {subImage ? (
                          <img src={subImage} className="w-8 h-8 rounded-md object-cover border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center"><ImageIcon className="w-3 h-3 text-muted-foreground opacity-50" /></div>
                        )}
                        <span className="text-sm font-medium">{subName}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeSubcategory(cat, sub)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  );
                })}

                {addingSubToCat === cat._id ? (
                  <div className="flex flex-col gap-2 mt-3 p-3 bg-background rounded-lg border border-border">
                    <Label className="text-xs font-semibold">New Subcategory</Label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          size="sm"
                          className="h-9 text-sm"
                          autoFocus
                          placeholder="Subcategory name..."
                          value={newSubName}
                          onChange={e => setNewSubName(e.target.value)}
                        />
                        <div className="relative">
                          <Input 
                             type="file" 
                             accept="image/*"
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                             onChange={e => e.target.files && setNewSubImage(e.target.files[0])}
                          />
                          <div className="h-9 flex items-center gap-2 px-3 border border-border rounded-md text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
                            <UploadCloud className="w-4 h-4" />
                            <span className="truncate">{newSubImage ? newSubImage.name : "Optional Image"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="h-9" onClick={() => addSubcategory(cat)} disabled={!newSubName}>Add</Button>
                        <Button size="sm" variant="ghost" className="h-9" onClick={() => { setAddingSubToCat(null); setNewSubName(''); setNewSubImage(null); }}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1 mt-2" onClick={() => { setAddingSubToCat(cat._id); setNewSubName(''); setNewSubImage(null); }}>
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
