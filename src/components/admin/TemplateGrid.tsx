import { useState } from 'react';
import { templates } from '@/data/mockData';
import { Template } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Eye, Sparkles } from 'lucide-react';

export function TemplateGrid() {
  const [templateList, setTemplateList] = useState<Template[]>(templates);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const activateTemplate = (templateId: string) => {
    setTemplateList(prev => 
      prev.map(t => ({
        ...t,
        isActive: t.id === templateId
      }))
    );
  };

  const categoryColors = {
    minimal: 'bg-secondary text-secondary-foreground',
    modern: 'bg-primary/10 text-primary',
    classic: 'bg-warning/10 text-warning',
    bold: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Homepage Templates</h3>
          <p className="text-sm text-muted-foreground">Select a template for your buyer app homepage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateList.map((template) => (
          <div 
            key={template.id}
            className={cn(
              "bg-card rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-elevated group",
              template.isActive 
                ? "border-primary shadow-lg" 
                : "border-border/50 hover:border-primary/50"
            )}
          >
            {/* Template Preview */}
            <div className="relative h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
              <span className="text-6xl">{template.preview}</span>
              {template.isActive && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2"
                  onClick={() => setPreviewId(template.id)}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-card-foreground">{template.name}</h4>
                <Badge variant="outline" className={categoryColors[template.category]}>
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              
              <Button 
                variant={template.isActive ? "outline" : "default"}
                className="w-full gap-2"
                onClick={() => activateTemplate(template.id)}
                disabled={template.isActive}
              >
                {template.isActive ? (
                  <>
                    <Check className="w-4 h-4" />
                    Active Template
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Activate Template
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
