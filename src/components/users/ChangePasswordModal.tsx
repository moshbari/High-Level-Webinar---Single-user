import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  userId: string;
  userEmail?: string;
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ userId, userEmail, open, onClose }: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendReset = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-send-password-reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session?.access_token}`,
          },
          body: JSON.stringify({
            userId,
            origin: window.location.origin,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || 'Failed to send reset email');
        return;
      }
      toast.success(`Password reset email sent${result.email ? ` to ${result.email}` : ''}`);
      onClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Send password reset email</DialogTitle>
          <DialogDescription>
            We'll email this user a secure link to choose a new password. Admins never see or pick the password directly.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <p className="text-muted-foreground">Recipient</p>
          <p className="font-medium">{userEmail || '—'}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSendReset}
            disabled={isLoading}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
            Send reset email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
