import { WebinarConfig } from '@/types/webinar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, GripVertical, Image, Users, ListChecks, FileText, Link2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LandingPageSettingsProps {
  config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>;
  onChange: (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function LandingPageSettings({ config, onChange }: LandingPageSettingsProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);

  const updateField = <K extends keyof typeof config>(field: K, value: typeof config[K]) => {
    onChange({ ...config, [field]: value });
  };

  const handleImageUpload = async (file: File, field: 'regFormHeroImageUrl' | 'presenter', presenterIndex?: number) => {
    const uploadKey = field === 'presenter' ? `presenter-${presenterIndex}` : 'hero';
    setUploading(uploadKey);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from('registration-assets').upload(path, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('registration-assets').getPublicUrl(path);

      if (field === 'regFormHeroImageUrl') {
        updateField('regFormHeroImageUrl', publicUrl);
      } else if (field === 'presenter' && presenterIndex !== undefined) {
        const updated = [...config.regFormPresenters];
        updated[presenterIndex] = { ...updated[presenterIndex], photoUrl: publicUrl };
        updateField('regFormPresenters', updated);
      }

      toast({ title: 'Image uploaded!' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(null);
    }
  };

  // Presenters
  const addPresenter = () => {
    updateField('regFormPresenters', [...config.regFormPresenters, { name: '', title: '', photoUrl: '' }]);
  };

  const updatePresenter = (index: number, field: string, value: string) => {
    const updated = [...config.regFormPresenters];
    updated[index] = { ...updated[index], [field]: value };
    updateField('regFormPresenters', updated);
  };

  const removePresenter = (index: number) => {
    updateField('regFormPresenters', config.regFormPresenters.filter((_, i) => i !== index));
  };

  // Bullets
  const addBullet = () => {
    updateField('regFormBullets', [...config.regFormBullets, '']);
  };

  const updateBullet = (index: number, value: string) => {
    const updated = [...config.regFormBullets];
    updated[index] = value;
    updateField('regFormBullets', updated);
  };

  const removeBullet = (index: number) => {
    updateField('regFormBullets', config.regFormBullets.filter((_, i) => i !== index));
  };

  // Legal Links
  const addLegalLink = () => {
    updateField('regFormLegalLinks', [...config.regFormLegalLinks, { label: '', url: '' }]);
  };

  const updateLegalLink = (index: number, field: string, value: string) => {
    const updated = [...config.regFormLegalLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateField('regFormLegalLinks', updated);
  };

  const removeLegalLink = (index: number) => {
    updateField('regFormLegalLinks', config.regFormLegalLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Hero Image */}
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-primary" />
          <Label className="font-medium">Hero / Banner Image</Label>
        </div>
        <div className="flex gap-2">
          <Input
            value={config.regFormHeroImageUrl}
            onChange={(e) => updateField('regFormHeroImageUrl', e.target.value)}
            placeholder="https://example.com/hero-image.jpg"
            className="input-field flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'regFormHeroImageUrl');
              }}
            />
            <Button type="button" variant="outline" size="icon" asChild disabled={uploading === 'hero'}>
              <span><Upload className="w-4 h-4" /></span>
            </Button>
          </label>
        </div>
        {config.regFormHeroImageUrl && (
          <img src={config.regFormHeroImageUrl} alt="Hero preview" className="w-full max-h-32 object-cover rounded-lg" />
        )}
      </div>

      {/* Headlines */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="regFormPreHeadline">Pre-Headline <span className="text-muted-foreground text-xs">(small text above headline)</span></Label>
          <Input
            id="regFormPreHeadline"
            value={config.regFormPreHeadline}
            onChange={(e) => updateField('regFormPreHeadline', e.target.value)}
            placeholder="FREE LIVE TRAINING"
            className="input-field"
          />
          <p className="text-[10px] text-muted-foreground/60">Format: **bold** · *italic* · __underline__</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regFormPostHeadline">Post-Headline <span className="text-muted-foreground text-xs">(text below headline)</span></Label>
          <Input
            id="regFormPostHeadline"
            value={config.regFormPostHeadline}
            onChange={(e) => updateField('regFormPostHeadline', e.target.value)}
            placeholder="Join thousands who have already transformed their business..."
            className="input-field"
          />
          <p className="text-[10px] text-muted-foreground/60">Format: **bold** · *italic* · __underline__</p>
        </div>
      </div>

      {/* Presenters */}
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <Label className="font-medium">Presenters / Partners</Label>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addPresenter}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        {config.regFormPresenters.map((presenter, i) => (
          <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GripVertical className="w-3 h-3" />
                Presenter {i + 1}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removePresenter(i)} className="h-7 w-7 p-0 text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                value={presenter.name}
                onChange={(e) => updatePresenter(i, 'name', e.target.value)}
                placeholder="John Smith"
                className="input-field"
              />
              <Input
                value={presenter.title}
                onChange={(e) => updatePresenter(i, 'title', e.target.value)}
                placeholder="CEO & Founder"
                className="input-field"
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={presenter.photoUrl}
                onChange={(e) => updatePresenter(i, 'photoUrl', e.target.value)}
                placeholder="Photo URL or upload →"
                className="input-field flex-1"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'presenter', i);
                  }}
                />
                <Button type="button" variant="outline" size="icon" asChild disabled={uploading === `presenter-${i}`}>
                  <span><Upload className="w-4 h-4" /></span>
                </Button>
              </label>
            </div>
            {presenter.photoUrl && (
              <img src={presenter.photoUrl} alt={presenter.name} className="w-12 h-12 rounded-full object-cover" />
            )}
          </div>
        ))}
      </div>

      {/* Bullet Points */}
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            <Label className="font-medium">Bullet Points</Label>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addBullet}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regFormBulletHeadline">Bullet Section Headline</Label>
          <Input
            id="regFormBulletHeadline"
            value={config.regFormBulletHeadline}
            onChange={(e) => updateField('regFormBulletHeadline', e.target.value)}
            placeholder="What You Will Learn:"
            className="input-field"
          />
        </div>
        <p className="text-[10px] text-muted-foreground/60 -mt-1">Format: **bold** · *italic* · __underline__</p>
        {config.regFormBullets.map((bullet, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-primary text-sm font-bold shrink-0">✓</span>
            <Input
              value={bullet}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder={`Bullet point ${i + 1}`}
              className="input-field flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeBullet(i)} className="h-8 w-8 p-0 text-destructive shrink-0">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <Label className="font-medium">Disclaimer</Label>
        </div>
        <Textarea
          value={config.regFormDisclaimerText}
          onChange={(e) => updateField('regFormDisclaimerText', e.target.value)}
          placeholder="This site is not a part of the Facebook website or Facebook Inc..."
          className="input-field min-h-[80px]"
        />
      </div>

      {/* Legal Links */}
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <Label className="font-medium">Legal Pages</Label>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addLegalLink}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        {config.regFormLegalLinks.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={link.label}
              onChange={(e) => updateLegalLink(i, 'label', e.target.value)}
              placeholder="Privacy Policy"
              className="input-field w-1/3"
            />
            <Input
              value={link.url}
              onChange={(e) => updateLegalLink(i, 'url', e.target.value)}
              placeholder="https://yoursite.com/privacy"
              className="input-field flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeLegalLink(i)} className="h-8 w-8 p-0 text-destructive shrink-0">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
