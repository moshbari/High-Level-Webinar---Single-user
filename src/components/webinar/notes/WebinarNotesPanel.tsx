import { useEffect, useRef } from 'react';
import { X, Mic, Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWebinarNotes } from '@/hooks/useWebinarNotes';
import { useVoiceDictation } from '@/hooks/useVoiceDictation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WebinarNotesPanelProps {
  webinarId: string;
  webinarName: string;
  onClose: () => void;
}

export const WebinarNotesPanel = ({
  webinarId,
  webinarName,
  onClose,
}: WebinarNotesPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { content, updateContent, saveStatus, isLoading, retrySave } = useWebinarNotes(webinarId);
  
  const { isRecording, isProcessing, toggleRecording } = useVoiceDictation({
    onTranscription: (text) => {
      const newContent = content ? `${content}\n${text}` : text;
      updateContent(newContent);
    },
    addTimestamp: true,
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="flex items-center gap-1.5 text-green-600 text-sm">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        );
      case 'error':
        return (
          <button 
            onClick={retrySave}
            className="flex items-center gap-1.5 text-destructive text-sm hover:underline"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Failed - Click to retry
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[400px] bg-card border-l border-border shadow-xl z-[100] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-lg">Notes</h3>
            <p className="text-sm text-muted-foreground truncate">{webinarName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Voice Dictation Button */}
        <div className="p-4 border-b border-border">
          <Button
            variant={isRecording ? 'destructive' : 'secondary'}
            onClick={toggleRecording}
            disabled={isProcessing}
            className={cn(
              'w-full h-12 gap-2',
              isRecording && 'animate-pulse'
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Transcribing...
              </>
            ) : isRecording ? (
              <>
                <Mic className="w-5 h-5" />
                Recording... Tap to stop
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Tap to dictate
              </>
            )}
          </Button>
        </div>

        {/* Notes Content */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Start typing your notes here, or use voice dictation..."
              className="flex-1 resize-none text-base leading-relaxed"
              style={{ minHeight: '300px' }}
            />
          )}
        </div>

        {/* Save Status Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          {renderSaveStatus()}
          <span className="text-xs text-muted-foreground">
            Auto-saves as you type
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
