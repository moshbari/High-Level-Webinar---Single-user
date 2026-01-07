import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebinarConfig } from '@/types/webinar';
import { getWebinars, deleteWebinar } from '@/lib/webinarStorage';
import { WebinarCard } from '@/components/admin/WebinarCard';
import { Button } from '@/components/ui/button';
import { Plus, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const [webinars, setWebinars] = useState<WebinarConfig[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setWebinars(getWebinars());
  }, []);

  const handleDelete = () => {
    if (deleteId) {
      deleteWebinar(deleteId);
      setWebinars(getWebinars());
      setDeleteId(null);
      toast({
        title: 'Webinar deleted',
        description: 'The webinar has been removed',
      });
    }
  };

  const handleViewCode = (id: string) => {
    navigate(`/webinar/${id}/code`);
  };

  const handlePreview = (id: string) => {
    navigate(`/webinar/${id}/preview`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">Webinar Studio</h1>
              <p className="text-xs text-muted-foreground">Setup & Embed Generator</p>
            </div>
          </div>
          <Button onClick={() => navigate('/webinar/new')} className="glow-button">
            <Plus className="w-4 h-4 mr-2" />
            New Webinar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {webinars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
              <Radio className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">No Webinars Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first webinar to get started. Configure settings, generate embed code, and go live!
            </p>
            <Button onClick={() => navigate('/webinar/new')} className="glow-button">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Webinar
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">Your Webinars</h2>
              <p className="text-sm text-muted-foreground">{webinars.length} webinar(s)</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {webinars.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  webinar={webinar}
                  onEdit={(id) => navigate(`/webinar/${id}/edit`)}
                  onDelete={setDeleteId}
                  onViewCode={handleViewCode}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webinar?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The webinar configuration will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
