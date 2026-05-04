import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Lock, Smartphone, LayoutGrid, Eye, ChevronRight, Settings2, Film, ImageIcon, ExternalLink, GripVertical, RefreshCw, Save, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const API = API_BASE_URL;

const SECTION_TYPES = [
  { value: 'BEST_OFFERS', label: 'Best Offers', description: 'Auto-pulls discounted products' },
  { value: 'NEW_ARRIVALS', label: 'New Arrivals', description: 'Auto-pulls recently added products' },
  { value: 'TOP_PICKS', label: 'Top Picks', description: 'Your manually curated picks' },
  { value: 'PROMOTIONAL_BANNER', label: 'Promotional Banner', description: 'Full-width promotional banner strip' },
];

const TEMPLATE_TYPES: Record<string, { value: string; label: string }[]> = {
  BEST_OFFERS: [{ value: 'PRODUCT_GRID', label: 'Product Grid (Scroll)' }, { value: 'PRODUCT_3X2', label: 'Product Grid (3×2)' }],
  NEW_ARRIVALS: [{ value: 'PRODUCT_GRID', label: 'Product Grid (Scroll)' }, { value: 'PRODUCT_3X2', label: 'Product Grid (3×2)' }],
  TOP_PICKS: [{ value: 'PRODUCT_GRID', label: 'Product Grid (Scroll)' }, { value: 'PRODUCT_3X2', label: 'Product Grid (3×2)' }],
  PROMOTIONAL_BANNER: [{ value: 'PROMOTIONAL_BANNER', label: 'Promotional Banner' }],
};

const SECTION_COLORS: Record<string, string> = {
  SEARCH_BANNER: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30',
  CATEGORY_GRID: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  BEST_OFFERS: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  NEW_ARRIVALS: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  TOP_PICKS: 'from-rose-500/20 to-red-500/20 border-rose-500/30',
  PROMOTIONAL_BANNER: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30',
};

const SECTION_LABELS: Record<string, string> = {
  SEARCH_BANNER: 'Search & Banner',
  CATEGORY_GRID: 'Category Grid',
  BEST_OFFERS: 'Best Offers',
  NEW_ARRIVALS: 'New Arrivals',
  TOP_PICKS: 'Top Picks',
  PROMOTIONAL_BANNER: 'Promotional Banner',
};

// ─── Mobile Simulator Components ────────────────────────────────────────────

function MobileSearchBanner() {
  return (
    <div className="px-2 pt-2 space-y-2">
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <span className="text-[8px] text-gray-400 flex-1">Search products...</span>
      </div>
      <div className="h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="text-center z-10">
          <p className="text-[8px] font-bold text-white">Summer Sale — 50% OFF</p>
          <p className="text-[6px] text-white/80">Shop Now →</p>
        </div>
        <div className="absolute bottom-1 right-2 flex gap-0.5">
          {[0, 1, 2].map(i => <div key={i} className={cn('w-1 h-1 rounded-full', i === 0 ? 'bg-white' : 'bg-white/40')} />)}
        </div>
      </div>
    </div>
  );
}

function MobileCategoryGrid() {
  const cats = ['Shirts', 'Pants', 'Suits', 'Sarees', 'Kurtis', 'More'];
  const colors = ['bg-indigo-100', 'bg-pink-100', 'bg-amber-100', 'bg-emerald-100', 'bg-purple-100', 'bg-gray-100'];
  return (
    <div className="px-2">
      <p className="text-[8px] font-semibold text-gray-700 mb-1.5">Shop by Category</p>
      <div className="grid grid-cols-3 gap-1">
        {cats.map((c, i) => (
          <div key={c} className={cn('rounded-lg p-1.5 flex flex-col items-center gap-0.5', colors[i])}>
            <div className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center">
              <LayoutGrid className="w-2.5 h-2.5 text-gray-500" />
            </div>
            <p className="text-[6px] text-gray-600 font-medium">{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileProductScroll({ title }: { title: string }) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[8px] font-semibold text-gray-700">{title}</p>
        <p className="text-[6px] text-indigo-500 flex items-center">See all <ChevronRight className="w-2 h-2" /></p>
      </div>
      <div className="flex gap-1.5 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-shrink-0 w-16">
            <div className="h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-1" />
            <p className="text-[6px] font-medium text-gray-700 truncate">Product {i}</p>
            <p className="text-[6px] text-indigo-600 font-bold">₹999</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileProduct3x2({ title }: { title: string }) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[8px] font-semibold text-gray-700">{title}</p>
        <p className="text-[6px] text-indigo-500 flex items-center">See all <ChevronRight className="w-2 h-2" /></p>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i}>
            <div className="h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md mb-0.5" />
            <p className="text-[5px] font-medium text-gray-700 truncate">Product {i}</p>
            <p className="text-[5px] text-indigo-600 font-bold">₹999</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePromoBanner({ title }: { title: string }) {
  return (
    <div className="px-2">
      <div className="h-12 bg-gradient-to-r from-orange-400 to-rose-400 rounded-lg flex items-center justify-between px-3 overflow-hidden relative">
        <div className="absolute -right-4 -top-2 w-12 h-12 bg-white/10 rounded-full" />
        <div>
          <p className="text-[8px] font-bold text-white">{title || 'Special Offer!'}</p>
          <p className="text-[6px] text-white/80">Limited time only</p>
        </div>
        <div className="bg-white/20 rounded-md px-2 py-0.5">
          <p className="text-[6px] text-white font-semibold">Shop</p>
        </div>
      </div>
    </div>
  );
}

function MobileSection({ section }: { section: any }) {
  if (!section.isActive) return null;
  const title = section.title || SECTION_LABELS[section.sectionType];
  switch (section.sectionType) {
    case 'SEARCH_BANNER': return <MobileSearchBanner />;
    case 'CATEGORY_GRID': return <MobileCategoryGrid />;
    case 'PROMOTIONAL_BANNER': return <MobilePromoBanner title={title} />;
    case 'BEST_OFFERS':
    case 'NEW_ARRIVALS':
    case 'TOP_PICKS':
      return section.templateType === 'PRODUCT_3X2'
        ? <MobileProduct3x2 title={title} />
        : <MobileProductScroll title={title} />;
    default: return null;
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomeBuilder() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ sectionType: '', templateType: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configureSection, setConfigureSection] = useState<any | null>(null); // which locked section is being configured
  const [sectionBanners, setSectionBanners] = useState<any[]>([]); // banners loaded for the configure dialog
  const [loadingBanners, setLoadingBanners] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const storeId = localStorage.getItem('storeId');

  const fetchSections = async () => {
    if (!storeId) return;
    try {
      const res = await fetch(`${API}/api/home-sections?storeId=${storeId}`);
      const data = await res.json();
      if (data.success) setSections(data.data);
    } catch {
      toast({ title: 'Error', description: 'Could not connect to server', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const initSections = async () => {
    if (!storeId) return;
    try {
      await fetch(`${API}/api/home-sections/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      });
      fetchSections();
    } catch { }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async () => {
    if (!form.sectionType || !form.templateType) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/home-sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, ...form })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Section added!' });
        setAddOpen(false);
        setForm({ sectionType: '', templateType: '', title: '' });
        fetchSections();
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      const res = await fetch(`${API}/api/home-sections/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast({ title: 'Section deleted' }); fetchSections(); }
      else toast({ title: 'Error', description: data.message, variant: 'destructive' });
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (section: any) => {
    try {
      const res = await fetch(`${API}/api/home-sections/${section._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !section.isActive })
      });
      const data = await res.json();
      if (data.success) fetchSections();
    } catch { }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch(`${API}/api/home-sections/reorder/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });
      const data = await res.json();
      if (data.success) setSections(data.data);
      else toast({ title: 'Error', description: data.message, variant: 'destructive' });
    } catch { }
  };

  const availableTemplates = form.sectionType ? (TEMPLATE_TYPES[form.sectionType] || []) : [];

  // Map HomeSection.sectionType → Banner.bannerType
  const SECTION_TO_BANNER_TYPE: Record<string, string> = {
    SEARCH_BANNER: 'SEARCH',
    CATEGORY_GRID: 'CATEGORY', // future
  };

  const openConfigure = async (section: any) => {
    setConfigureSection(section);
    const bannerType = SECTION_TO_BANNER_TYPE[section.sectionType];
    if (!bannerType || !storeId) return;
    setLoadingBanners(true);
    try {
      const res = await fetch(`${API}/api/banners?storeId=${storeId}&bannerType=${bannerType}`);
      const data = await res.json();
      if (data.success) setSectionBanners(data.data);
    } catch { }
    finally { setLoadingBanners(false); }
  };

  const closeConfigure = () => { setConfigureSection(null); setSectionBanners([]); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Home Section Builder</h1>
          <p className="text-sm text-muted-foreground">Design your buyer app's home page layout with live preview.</p>
        </div>
        <div className="flex gap-2">
          {sections.length === 0 && !loading && (
            <Button variant="outline" onClick={initSections}>Initialize Default Sections</Button>
          )}
          {sections.length > 0 && (
            <Button variant="outline" onClick={async () => {
              try {
                const res = await fetch(`${API}/api/home-sections/resync`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ storeId })
                });
                const data = await res.json();
                if (data.success) toast({ title: 'Resynced successfully!' });
                else toast({ title: 'Resync failed', variant: 'destructive' });
              } catch (err) {
                toast({ title: 'Network error', variant: 'destructive' });
              }
            }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Force Resync
            </Button>
          )}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Add Section</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Add New Section</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label>Section Type</Label>
                  <Select value={form.sectionType} onValueChange={v => setForm({ ...form, sectionType: v, templateType: '' })}>
                    <SelectTrigger><SelectValue placeholder="Choose a section type…" /></SelectTrigger>
                    <SelectContent>
                      {SECTION_TYPES.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          <div>
                            <p className="font-medium">{s.label}</p>
                            <p className="text-xs text-muted-foreground">{s.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {form.sectionType && (
                  <div className="space-y-1.5">
                    <Label>Template (Visual Layout)</Label>
                    <Select value={form.templateType} onValueChange={v => setForm({ ...form, templateType: v })}>
                      <SelectTrigger><SelectValue placeholder="Choose a template…" /></SelectTrigger>
                      <SelectContent>
                        {availableTemplates.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Section Title (Optional)</Label>
                  <Input
                    placeholder={`e.g. ${SECTION_TYPES.find(s => s.value === form.sectionType)?.label || 'Section Title'}`}
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button
                    className="gradient-primary text-primary-foreground"
                    onClick={handleAddSection}
                    disabled={!form.sectionType || !form.templateType || isSubmitting}
                  >
                    {isSubmitting ? 'Adding…' : 'Add Section'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left: Section List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading sections…</div>
          ) : sections.length === 0 ? (
            <div className="text-center border rounded-lg p-12 bg-card">
              <LayoutGrid className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No sections yet</p>
              <p className="text-sm text-muted-foreground mt-1">Click "Initialize Default Sections" to get started.</p>
            </div>
          ) : (
            sections.map((section, idx) => (
              <div
                key={section._id}
                className={cn(
                  'rounded-xl border bg-gradient-to-r p-4 flex items-center gap-4 transition-all',
                  SECTION_COLORS[section.sectionType],
                  !section.isActive && 'opacity-50 grayscale'
                )}
              >
                {/* Order badge */}
                <div className="w-7 h-7 rounded-full bg-background/70 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-foreground">{section.title || SECTION_LABELS[section.sectionType]}</p>
                    {section.isLocked && (
                      <Badge variant="secondary" className="text-[9px] gap-1 py-0 px-1.5">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[9px] py-0">{SECTION_LABELS[section.sectionType]}</Badge>
                    <span className="text-[10px] text-muted-foreground">{section.templateType?.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Switch
                    checked={section.isActive}
                    onCheckedChange={() => handleToggleActive(section)}
                    className="data-[state=checked]:bg-green-500 scale-75"
                  />
                  {/* Configure button for locked sections */}
                  {section.isLocked && SECTION_TO_BANNER_TYPE[section.sectionType] && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => openConfigure(section)}
                    >
                      <Settings2 className="w-3 h-3" /> Configure
                    </Button>
                  )}
                  {!section.isLocked && (
                    <>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        onClick={() => handleReorder(section._id, 'up')}
                        disabled={idx === 0 || sections[idx - 1]?.isLocked}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        onClick={() => handleReorder(section._id, 'down')}
                        disabled={idx === sections.length - 1 || sections[idx + 1]?.isLocked}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(section._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: iPhone 15 Pro Simulator */}
        <div className="sticky top-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Live Preview</span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Buyer App</span>
          </div>

          {/* iPhone 15 Pro Frame */}
          <div className="relative" style={{ width: 230 }}>

            {/* Left side buttons — volume up, volume down, silent switch */}
            <div className="absolute -left-[5px] top-[80px] w-[4px] h-[28px] bg-gradient-to-b from-[#6e6e73] to-[#48484a] rounded-l-sm" />
            <div className="absolute -left-[5px] top-[118px] w-[4px] h-[42px] bg-gradient-to-b from-[#6e6e73] to-[#48484a] rounded-l-sm" />
            <div className="absolute -left-[5px] top-[170px] w-[4px] h-[42px] bg-gradient-to-b from-[#6e6e73] to-[#48484a] rounded-l-sm" />

            {/* Right side button — power/lock */}
            <div className="absolute -right-[5px] top-[130px] w-[4px] h-[58px] bg-gradient-to-b from-[#6e6e73] to-[#48484a] rounded-r-sm" />

            {/* Phone body — titanium finish */}
            <div
              className="relative rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #2c2c2e, #1c1c1e, #3a3a3c)',
                padding: '10px',
              }}
            >
              {/* Inner bezel shine */}
              <div
                className="absolute inset-0 rounded-[40px] pointer-events-none"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.4)',
                }}
              />

              {/* Screen */}
              <div
                className="relative rounded-[32px] overflow-hidden bg-white"
                style={{ height: 460 }}
              >
                {/* Dynamic Island */}
                <div
                  className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5"
                  style={{
                    width: 72,
                    height: 22,
                    background: '#000',
                    borderRadius: 40,
                  }}
                >
                  {/* Front camera dot */}
                  <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#0a0a0a]" />
                  </div>
                  {/* Face ID sensor */}
                  <div className="w-1 h-1 rounded-full bg-[#1e1e1e]" />
                </div>

                {/* iOS Status bar */}
                <div className="relative z-10 bg-white px-4 pt-10 pb-1 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gray-900 tracking-tight">9:41</span>
                  <div className="flex items-center gap-1">
                    {/* Signal bars */}
                    <svg width="12" height="9" viewBox="0 0 17 12" fill="none">
                      <rect x="0" y="7" width="3" height="5" rx="0.5" fill="#1c1c1e" />
                      <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="#1c1c1e" />
                      <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#1c1c1e" />
                      <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#e5e5ea" />
                    </svg>
                    {/* WiFi */}
                    <svg width="12" height="9" viewBox="0 0 16 12" fill="none">
                      <path d="M8 10.5a1 1 0 100-2 1 1 0 000 2z" fill="#1c1c1e" />
                      <path d="M4.5 7.5C5.5 6.5 6.7 6 8 6s2.5.5 3.5 1.5" stroke="#1c1c1e" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M1.5 4.5C3.2 2.8 5.5 2 8 2s4.8.8 6.5 2.5" stroke="#1c1c1e" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {/* Battery */}
                    <div className="flex items-center gap-0.5">
                      <div className="w-5 h-2.5 border border-gray-800 rounded-[2px] relative flex items-center px-[1px]">
                        <div className="h-1.5 bg-gray-800 rounded-[1px]" style={{ width: '75%' }} />
                      </div>
                      <div className="w-0.5 h-1.5 bg-gray-700 rounded-r-sm" />
                    </div>
                  </div>
                </div>

                {/* Scrollable app content */}
                <div
                  className="overflow-y-auto space-y-2.5 pb-6"
                  style={{
                    height: 'calc(100% - 52px)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  } as React.CSSProperties}
                >
                  <style>{`.__phone_scroll__::-webkit-scrollbar { display: none; }`}</style>
                  {sections.filter(s => s.isActive).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                        <Eye className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400">Your layout preview</p>
                      <p className="text-[8px] text-gray-300 mt-0.5">will appear here</p>
                    </div>
                  ) : (
                    sections.map((section) => (
                      <MobileSection key={section._id} section={section} />
                    ))
                  )}
                </div>

                {/* iOS home indicator bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full opacity-30" />
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60">iPhone 15 Pro · Buyer App Preview</p>
        </div>
      </div>

      {/* ── Configure Section Dialog ─────────────────────────────────────────── */}
      {configureSection && (
        <Dialog open={!!configureSection} onOpenChange={(open) => { if (!open) closeConfigure(); }}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-500" />
                Configure — {SECTION_LABELS[configureSection.sectionType]}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-1">
              {/* Explainer */}
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 space-y-1">
                <p className="font-semibold">How this section works:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5 text-indigo-600">
                  <li><strong>Background banners</strong> — a looping video or image slideshow behind the search bar.</li>
                  <li><strong>Frontend banners</strong> — carousel images buyers see and tap above the search bar.</li>
                  <li>Go to <strong>Banners</strong> page to add, edit, or delete banners for this section.</li>
                </ul>
              </div>

              {loadingBanners ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Loading banners…</div>
              ) : sectionBanners.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-xl">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-foreground">No banners added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create banners in the Banners page and tag them as<br /><strong>"{SECTION_LABELS[configureSection.sectionType]}"</strong></p>
                </div>
              ) : (
                (['BACKGROUND', 'FRONTEND'] as const).map(pos => {
                  const positionBanners = sectionBanners.filter(b => b.position === pos);
                  if (positionBanners.length === 0) return null;
                  return (
                    <div key={pos} className="space-y-2">
                      {/* Position header */}
                      <div className={cn(
                        'flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full w-fit border',
                        pos === 'BACKGROUND'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      )}>
                        {pos === 'BACKGROUND' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        {pos === 'BACKGROUND' ? 'Background' : 'Frontend'} — {positionBanners.length} banner{positionBanners.length > 1 ? 's' : ''}
                      </div>

                      {positionBanners.map(banner => {
                        const thumb = banner.mediaImages?.[0] || banner.backgroundImage;
                        const isVideo = banner.mediaType === 'VIDEO';
                        return (
                          <div
                            key={banner._id}
                            className={cn(
                              'flex items-center gap-3 p-3 border rounded-lg',
                              !banner.isActive && 'opacity-50 grayscale'
                            )}
                          >
                            {/* Thumbnail */}
                            <div className="w-20 h-14 rounded-lg bg-secondary shrink-0 overflow-hidden border flex items-center justify-center relative">
                              {isVideo
                                ? <Film className="w-5 h-5 text-muted-foreground" />
                                : thumb
                                  ? <img src={thumb} alt={banner.title} className="w-full h-full object-cover" />
                                  : <ImageIcon className="w-5 h-5 text-muted-foreground" />
                              }
                              {isVideo && (
                                <span className="absolute bottom-0.5 right-0.5 text-[7px] bg-purple-600 text-white px-1 rounded">VIDEO</span>
                              )}
                              {!isVideo && banner.mediaImages?.length > 1 && (
                                <span className="absolute top-0.5 right-0.5 text-[7px] bg-gray-800 text-white px-1 rounded">
                                  ×{banner.mediaImages.length}
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{banner.title}</p>
                              {banner.description && (
                                <p className="text-xs text-muted-foreground truncate">{banner.description}</p>
                              )}
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={cn(
                                  'text-[9px] px-1.5 py-0.5 rounded-full border font-medium',
                                  banner.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                                )}>
                                  {banner.isActive ? '● Active' : '○ Inactive'}
                                </span>
                                {!isVideo && (
                                  <span className="text-[9px] text-muted-foreground">
                                    {banner.mediaImages?.length || 0} image{(banner.mediaImages?.length || 0) !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  To add, edit, or delete banners, go to the Banners page.
                </p>
                <Button
                  className="gap-2 gradient-primary text-primary-foreground"
                  onClick={() => { closeConfigure(); navigate('/banners'); }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Manage Banners
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
