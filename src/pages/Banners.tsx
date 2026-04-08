import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/api';
import {
  Plus, ArrowUp, ArrowDown, Edit, Trash2, Image as ImageIcon,
  Video, UploadCloud, X, Film, Eye, Layers
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const API = API_BASE_URL;

const POSITION_INFO = {
  BACKGROUND: {
    label: 'Background',
    description: 'Sits behind the search bar. Accepts a looping video OR multiple slideshow images.',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  FRONTEND: {
    label: 'Frontend',
    description: 'Carousel banners users see & tap. Accepts a backdrop image + multiple slide images. No video.',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

const SECTION_LABELS: Record<string, string> = {
  SEARCH:       'Search & Banner',
  PROMOTIONAL:  'Promotional',
};

// ─── Empty form state ──────────────────────────────────────────────────────────
const emptyForm = () => ({
  title:           '',
  description:     '',
  bannerType:      'SEARCH' as 'SEARCH' | 'PROMOTIONAL',
  position:        '' as '' | 'BACKGROUND' | 'FRONTEND',
  mediaType:       'IMAGES' as 'IMAGES' | 'VIDEO',
  linkType:        'none' as 'none' | 'category' | 'product' | 'external',
  link:            '',
  linkId:          '',
  startDate:       '',
  endDate:         '',
  // Files (not sent as state, kept as refs)
});

export default function Banners() {
  const [bannerList, setBannerList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const { toast } = useToast();

  // File refs — not stored in state to avoid re-renders
  const mediaImagesRef    = useRef<File[]>([]);
  const backgroundImgRef  = useRef<File | null>(null);
  const videoFileRef      = useRef<File | null>(null);

  // Preview state (for showing selected files before upload)
  const [mediaImagePreviews,   setMediaImagePreviews]   = useState<string[]>([]);
  const [backgroundImgPreview, setBackgroundImgPreview] = useState<string>('');
  const [videoPreview,         setVideoPreview]         = useState<string>('');

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const storeId = localStorage.getItem('storeId') || '';
      const [bannersRes, catRes, prodRes] = await Promise.all([
        fetch(`${API}/api/banners?storeId=${storeId}`),
        fetch(`${API}/api/categories`),
        fetch(`${API}/api/products?storeId=${storeId}`),
      ]);
      const [bannersData, catData, prodData] = await Promise.all([
        bannersRes.json(), catRes.json(), prodRes.json(),
      ]);
      if (bannersData.success) setBannerList(bannersData.data);
      if (catData.success)     setCategories(catData.data);
      if (prodData.success)    setProducts(prodData.data);
    } catch {
      toast({ title: 'Error fetching data', variant: 'destructive' });
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Reset form & file refs ───────────────────────────────────────────────
  const resetForm = () => {
    setForm(emptyForm());
    setEditingBanner(null);
    mediaImagesRef.current   = [];
    backgroundImgRef.current = null;
    videoFileRef.current     = null;
    setMediaImagePreviews([]);
    setBackgroundImgPreview('');
    setVideoPreview('');
  };

  // ─── File change handlers ─────────────────────────────────────────────────
  const handleMediaImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    mediaImagesRef.current = files;
    setMediaImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleBackgroundImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    backgroundImgRef.current = file;
    setBackgroundImgPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate video type
    if (!file.type.startsWith('video/')) {
      toast({ title: 'Only video files allowed', variant: 'destructive' });
      return;
    }
    // 50MB limit check
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'Video must be under 50MB', variant: 'destructive' });
      return;
    }
    videoFileRef.current = file;
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeMediaImage = (idx: number) => {
    const updated = mediaImagesRef.current.filter((_, i) => i !== idx);
    mediaImagesRef.current = updated;
    setMediaImagePreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const removeVideo = () => {
    videoFileRef.current = null;
    setVideoPreview('');
  };

  // ─── Validate form before submit ─────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim()) return 'Banner title is required.';
    if (!form.position) return 'Please select a banner position.';

    if (form.position === 'BACKGROUND') {
      if (form.mediaType === 'VIDEO') {
        if (!editingBanner && !videoFileRef.current) return 'Please upload a video file.';
      } else {
        if (!editingBanner && mediaImagesRef.current.length === 0) return 'Please upload at least one background image.';
      }
    }

    if (form.position === 'FRONTEND') {
      if (!editingBanner && mediaImagesRef.current.length === 0) return 'Please upload at least one carousel image.';
    }

    return null;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const error = validate();
    if (error) { toast({ title: error, variant: 'destructive' }); return; }

    setIsSubmitting(true);
    const storeId = localStorage.getItem('storeId') || '';

    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('description', form.description);
      fd.append('bannerType',  form.bannerType);
      fd.append('position',    form.position);
      fd.append('mediaType',   form.position === 'BACKGROUND' ? form.mediaType : 'IMAGES');
      fd.append('linkType',    form.linkType);
      fd.append('link',        form.link);
      fd.append('linkId',      form.linkId);
      fd.append('storeId',     storeId);
      if (form.startDate) fd.append('startDate', new Date(form.startDate).toISOString());
      if (form.endDate)   fd.append('endDate',   new Date(form.endDate).toISOString());
      if (!editingBanner) fd.append('displayOrder', String(bannerList.length + 1));

      let url = '';
      let method = editingBanner ? 'PUT' : 'POST';

      // Choose endpoint based on position + mediaType
      if (form.position === 'BACKGROUND' && form.mediaType === 'VIDEO') {
        url = editingBanner
          ? `${API}/api/banners/${editingBanner._id}/images` // no dedicated video PUT, just update meta
          : `${API}/api/banners/video`;
        if (!editingBanner && videoFileRef.current) {
          fd.append('videoFile', videoFileRef.current);
        }
      } else {
        url = editingBanner
          ? `${API}/api/banners/${editingBanner._id}/images`
          : `${API}/api/banners/images`;
        mediaImagesRef.current.forEach(f => fd.append('mediaImages', f));
        if (form.position === 'FRONTEND' && backgroundImgRef.current) {
          fd.append('backgroundImage', backgroundImgRef.current);
        }
      }

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (data.success) {
        toast({ title: editingBanner ? 'Banner updated!' : 'Banner created!' });
        setAddOpen(false);
        resetForm();
        fetchData();
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error. Is the backend running?', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`${API}/api/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast({ title: 'Banner deleted' }); fetchData(); }
      else toast({ title: 'Error', description: data.message, variant: 'destructive' });
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
  };

  // ─── Toggle active ────────────────────────────────────────────────────────
  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/banners/${id}/toggle`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch { }
  };

  // ─── Reorder ──────────────────────────────────────────────────────────────
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch(`${API}/api/banners/${id}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch { }
  };

  // ─── Open edit ────────────────────────────────────────────────────────────
  const openEdit = (banner: any) => {
    setEditingBanner(banner);
    setForm({
      title:       banner.title || '',
      description: banner.description || '',
      bannerType:  banner.bannerType || 'SEARCH',
      position:    banner.position   || 'FRONTEND',
      mediaType:   banner.mediaType  || 'IMAGES',
      linkType:    banner.linkType   || 'none',
      link:        banner.link       || '',
      linkId:      banner.linkId     || '',
      startDate:   banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate:     banner.endDate   ? banner.endDate.split('T')[0]   : '',
    });
    // Show existing previews from URLs
    setMediaImagePreviews(banner.mediaImages || []);
    setBackgroundImgPreview(banner.backgroundImage || '');
    setVideoPreview(banner.videoUrl || '');
    setAddOpen(true);
  };

  // ─── Group banners by section & position ─────────────────────────────────
  const grouped: Record<string, Record<string, any[]>> = {};
  bannerList.forEach(b => {
    if (!grouped[b.bannerType])               grouped[b.bannerType] = {};
    if (!grouped[b.bannerType][b.position])   grouped[b.bannerType][b.position] = [];
    grouped[b.bannerType][b.position].push(b);
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banner Management</h1>
          <p className="text-sm text-muted-foreground">Manage banners for each section with position-based upload types.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setAddOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4" /> Add Banner
            </Button>
          </DialogTrigger>

          {/* ── Add / Edit Dialog ── */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-2">
              {/* Title */}
              <div className="space-y-1.5">
                <Label>Banner Title <span className="text-destructive">*</span></Label>
                <Input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Summer Sale — 50% OFF"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label>Description (Optional)</Label>
                <Input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short tagline..."
                />
              </div>

              {/* Section + Position row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Section <span className="text-destructive">*</span></Label>
                  <Select value={form.bannerType} onValueChange={(v: any) => setForm({ ...form, bannerType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEARCH">Search &amp; Banner Section</SelectItem>
                      <SelectItem value="PROMOTIONAL">Promotional Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Banner Position <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.position}
                    onValueChange={(v: any) => setForm({ ...form, position: v, mediaType: 'IMAGES' })}
                    disabled={!!editingBanner}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BACKGROUND">
                        <div>
                          <p className="font-medium">Background</p>
                          <p className="text-xs text-muted-foreground">Video or images behind search bar</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="FRONTEND">
                        <div>
                          <p className="font-medium">Frontend</p>
                          <p className="text-xs text-muted-foreground">Carousel banners users see (no video)</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {editingBanner && (
                    <p className="text-[10px] text-muted-foreground">Position cannot be changed after creation.</p>
                  )}
                </div>
              </div>

              {/* Position info chip */}
              {form.position && (
                <div className={cn('rounded-lg border px-3 py-2 text-xs', POSITION_INFO[form.position].color)}>
                  <strong>{POSITION_INFO[form.position].label}:</strong> {POSITION_INFO[form.position].description}
                </div>
              )}

              {/* ── BACKGROUND OPTIONS ── */}
              {form.position === 'BACKGROUND' && (
                <div className="space-y-4 p-4 border rounded-xl bg-purple-50/50">
                  <div className="space-y-1.5">
                    <Label>Media Type <span className="text-destructive">*</span></Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, mediaType: 'VIDEO' })}
                        className={cn(
                          'flex-1 flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium transition-all',
                          form.mediaType === 'VIDEO'
                            ? 'border-purple-500 bg-purple-100 text-purple-700'
                            : 'border-border bg-background text-foreground hover:bg-secondary'
                        )}
                      >
                        <Film className="w-4 h-4" />
                        One Video
                        <span className="text-[10px] text-muted-foreground ml-auto">Max 50MB · mp4/webm</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, mediaType: 'IMAGES' })}
                        className={cn(
                          'flex-1 flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium transition-all',
                          form.mediaType === 'IMAGES'
                            ? 'border-purple-500 bg-purple-100 text-purple-700'
                            : 'border-border bg-background text-foreground hover:bg-secondary'
                        )}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Multiple Images
                        <span className="text-[10px] text-muted-foreground ml-auto">Max 10MB each</span>
                      </button>
                    </div>
                  </div>

                  {/* Video upload */}
                  {form.mediaType === 'VIDEO' && (
                    <div className="space-y-1.5">
                      <Label>Upload Video {!editingBanner && <span className="text-destructive">*</span>}</Label>
                      {videoPreview ? (
                        <div className="relative rounded-lg overflow-hidden border">
                          <video src={videoPreview} className="w-full h-32 object-cover" controls />
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload video</p>
                            <p className="text-xs text-muted-foreground mt-1">MP4, WebM · Max 50MB</p>
                          </div>
                          <input type="file" className="hidden" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoChange} />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Background slideshow images */}
                  {form.mediaType === 'IMAGES' && (
                    <div className="space-y-1.5">
                      <Label>Background Slideshow Images {!editingBanner && <span className="text-destructive">*</span>}</Label>
                      <MediaImageUploader
                        previews={mediaImagePreviews}
                        onFilesSelected={handleMediaImagesChange}
                        onRemove={removeMediaImage}
                        accept="image/*"
                        hint="Upload multiple images for background slideshow"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── FRONTEND OPTIONS ── */}
              {form.position === 'FRONTEND' && (
                <div className="space-y-4 p-4 border rounded-xl bg-blue-50/50">
                  {/* Backdrop image */}
                  <div className="space-y-1.5">
                    <Label>
                      Backdrop Image (Optional)
                      <span className="text-[10px] text-muted-foreground ml-2">Static background behind the carousel</span>
                    </Label>
                    {backgroundImgPreview ? (
                      <div className="relative rounded-lg overflow-hidden border h-20">
                        <img src={backgroundImgPreview} className="w-full h-full object-cover" alt="backdrop" />
                        <button
                          type="button"
                          onClick={() => { backgroundImgRef.current = null; setBackgroundImgPreview(''); }}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                          <Layers className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Click to upload backdrop image (optional)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleBackgroundImgChange} />
                      </label>
                    )}
                  </div>

                  {/* Carousel slides */}
                  <div className="space-y-1.5">
                    <Label>
                      Carousel Slide Images {!editingBanner && <span className="text-destructive">*</span>}
                      <span className="text-[10px] text-muted-foreground ml-2">Users swipe through these banners</span>
                    </Label>
                    <MediaImageUploader
                      previews={mediaImagePreviews}
                      onFilesSelected={handleMediaImagesChange}
                      onRemove={removeMediaImage}
                      accept="image/*"
                      hint="Upload one or more carousel banner images"
                    />
                  </div>
                </div>
              )}

              {/* Link settings (for FRONTEND) */}
              {form.position === 'FRONTEND' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tap Link Type</Label>
                    <Select value={form.linkType} onValueChange={(v: any) => setForm({ ...form, linkType: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Link</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="external">External URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.linkType === 'external' && (
                    <div className="space-y-1.5">
                      <Label>URL</Label>
                      <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                    </div>
                  )}
                  {form.linkType === 'category' && (
                    <div className="space-y-1.5">
                      <Label>Select Category</Label>
                      <Select value={form.linkId} onValueChange={v => setForm({ ...form, linkId: v })}>
                        <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {form.linkType === 'product' && (
                    <div className="space-y-1.5">
                      <Label>Select Product</Label>
                      <Select value={form.linkId} onValueChange={v => setForm({ ...form, linkId: v })}>
                        <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                        <SelectContent>
                          {products.map(p => <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Date (Optional)</Label>
                  <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date (Optional)</Label>
                  <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>Cancel</Button>
                <Button
                  className="gradient-primary text-primary-foreground"
                  onClick={handleSave}
                  disabled={!form.title || !form.position || isSubmitting}
                >
                  {isSubmitting ? 'Saving…' : editingBanner ? 'Update Banner' : 'Save Banner'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Banner List (grouped by section → position) ── */}
      {bannerList.length === 0 ? (
        <div className="text-center p-12 border rounded-xl bg-card">
          <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground">No banners yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Banner" to create your first banner.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([sectionKey, positions]) => (
          <div key={sectionKey} className="space-y-3">
            <h2 className="text-base font-semibold text-foreground border-b pb-2">
              {SECTION_LABELS[sectionKey]} Section
            </h2>
            {Object.entries(positions).map(([posKey, banners]) => (
              <div key={posKey} className="space-y-2">
                <div className={cn(
                  'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                  posKey === 'BACKGROUND' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                )}>
                  {posKey === 'BACKGROUND' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {posKey === 'BACKGROUND' ? 'Background' : 'Frontend'}
                </div>

                {(banners as any[]).map((banner, idx) => (
                  <BannerCard
                    key={banner._id}
                    banner={banner}
                    idx={idx}
                    total={(banners as any[]).length}
                    onToggle={() => handleToggle(banner._id)}
                    onEdit={() => openEdit(banner)}
                    onDelete={() => handleDelete(banner._id)}
                    onReorder={(dir) => handleReorder(banner._id, dir)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ─── Reusable multi-image uploader ───────────────────────────────────────────
function MediaImageUploader({ previews, onFilesSelected, onRemove, accept, hint }: {
  previews: string[];
  onFilesSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
  accept: string;
  hint: string;
}) {
  return (
    <div className="space-y-2">
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <img src={src} className="w-full h-full object-cover" alt={`preview-${i}`} />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          {/* Add more button */}
          <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground mt-0.5">Add more</span>
            <input type="file" className="hidden" accept={accept} multiple onChange={onFilesSelected} />
          </label>
        </div>
      )}
      {previews.length === 0 && (
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{hint}</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Max 10MB each</p>
          </div>
          <input type="file" className="hidden" accept={accept} multiple onChange={onFilesSelected} />
        </label>
      )}
    </div>
  );
}

// ─── Banner card component ───────────────────────────────────────────────────
function BannerCard({ banner, idx, total, onToggle, onEdit, onDelete, onReorder }: {
  banner: any; idx: number; total: number;
  onToggle: () => void; onEdit: () => void; onDelete: () => void;
  onReorder: (d: 'up' | 'down') => void;
}) {
  const thumb = banner.mediaImages?.[0] || banner.backgroundImage;
  const isVideo = banner.mediaType === 'VIDEO';

  return (
    <div className={cn('modern-card p-4 flex items-center gap-4 animate-fade-in', !banner.isActive && 'opacity-50 grayscale')}>
      {/* Reorder */}
      <div className="flex flex-col gap-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === 0} onClick={() => onReorder('up')}>
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={idx === total - 1} onClick={() => onReorder('down')}>
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Thumbnail */}
      <div className="w-28 h-16 rounded-lg bg-secondary shrink-0 overflow-hidden border border-border flex items-center justify-center relative">
        {isVideo
          ? <Film className="w-6 h-6 text-muted-foreground" />
          : thumb
            ? <img src={thumb} alt={banner.title} className="w-full h-full object-cover" />
            : <ImageIcon className="w-6 h-6 text-muted-foreground" />
        }
        {isVideo && (
          <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-purple-600 text-white px-1 rounded">VIDEO</span>
        )}
        {banner.mediaImages?.length > 1 && (
          <span className="absolute top-0.5 right-0.5 text-[8px] bg-gray-800 text-white px-1 rounded">
            +{banner.mediaImages.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{banner.title}</p>
        <p className="text-xs text-muted-foreground truncate">{banner.description || 'No description'}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge variant="outline" className="text-[9px] py-0">{SECTION_LABELS[banner.bannerType]}</Badge>
          <Badge
            className={cn('text-[9px] py-0 border',
              banner.position === 'BACKGROUND' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
            )}
          >
            {banner.position}
          </Badge>
          {isVideo && <Badge className="text-[9px] py-0 bg-gray-200 text-gray-700 border-gray-300">VIDEO</Badge>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <Switch checked={banner.isActive} onCheckedChange={onToggle} className="data-[state=checked]:bg-green-500" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:text-primary" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
