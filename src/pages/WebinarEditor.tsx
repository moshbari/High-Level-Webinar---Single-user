import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WebinarConfig, DEFAULT_WEBINAR_CONFIG } from '@/types/webinar';
import { getWebinar, saveWebinar, updateWebinar, createDefaultWebinar } from '@/lib/webinarStorage';
import { WebinarForm } from '@/components/admin/WebinarForm';
import { WebinarPreview } from '@/components/admin/WebinarPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function WebinarEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  
  const [config, setConfig] = useState<Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>>(createDefaultWebinar());
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = getWebinar(id);
      if (existing) {
        const { id: _, createdAt, updatedAt, ...rest } = existing;
        setConfig(rest);
      } else {
        navigate('/');
      }
    }
  }, [id, isEditing, navigate]);

  const handleSave = async () => {
    if (!config.webinarName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a webinar name',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    
    try {
      if (isEditing) {
        updateWebinar(id, config);
        toast({
          title: 'Webinar updated',
          description: 'Your changes have been saved',
        });
      } else {
        const newWebinar = saveWebinar(config);
        toast({
          title: 'Webinar created',
          description: 'Your webinar is ready to use',
        });
        navigate(`/webinar/${newWebinar.id}/code`);
        return;
      }
    } catch (error) {
      toast({
        title: 'Error saving',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-xl">
                {isEditing ? 'Edit Webinar' : 'Create Webinar'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {config.webinarName || 'Configure your webinar settings'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden lg:flex"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="glow-button">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Webinar'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WebinarForm config={config} onChange={setConfig} />
          </motion.div>
          
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="mb-4">
                <h3 className="font-display font-semibold text-lg mb-1">Live Preview</h3>
                <p className="text-sm text-muted-foreground">See how your webinar will look</p>
              </div>
              <WebinarPreview config={config} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
