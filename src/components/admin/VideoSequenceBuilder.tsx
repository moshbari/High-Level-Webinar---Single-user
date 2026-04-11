import { useState } from 'react';
import { Clip, VideoSequenceItem, VideoSequenceClip, InterstitialQuiz, QuizOption } from '@/types/clip';
import { formatDuration } from '@/lib/clipStorage';
import { useClipsByIds } from '@/hooks/useClips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipPicker } from './ClipPicker';
import { AddClipModal } from './AddClipModal';
import { useSaveClip } from '@/hooks/useClips';
import { GripVertical, ChevronUp, ChevronDown, Trash2, Plus, Film, Loader2, HelpCircle, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface VideoSequenceBuilderProps {
  sequence: VideoSequenceItem[];
  onChange: (sequence: VideoSequenceItem[]) => void;
}

const DEFAULT_INTERSTITIAL: InterstitialQuiz = {
  question: '',
  options: [
    { id: crypto.randomUUID(), text: '', isCorrect: true },
    { id: crypto.randomUUID(), text: '', isCorrect: false },
  ],
  correctFeedback: 'Correct! 🎉',
  wrongFeedback: 'Not quite. The correct answer was shown above.',
  autoAdvanceSeconds: 3,
};

export function VideoSequenceBuilder({ sequence, onChange }: VideoSequenceBuilderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const saveClipMutation = useSaveClip();
  
  const clipIds = sequence.map(s => s.clipId);
  const { data: clips = [], isLoading } = useClipsByIds(clipIds);
  
  const sequenceClips: (VideoSequenceClip & { interstitial?: InterstitialQuiz })[] = sequence
    .map(item => {
      const clip = clips.find(c => c.id === item.clipId);
      if (!clip) return null;
      return {
        id: clip.id,
        name: clip.name,
        url: clip.url,
        durationSeconds: clip.durationSeconds,
        order: item.order,
        interstitial: item.interstitial,
      };
    })
    .filter(Boolean) as (VideoSequenceClip & { interstitial?: InterstitialQuiz })[];

  sequenceClips.sort((a, b) => a.order - b.order);
  
  const totalDuration = sequenceClips.reduce((sum, c) => sum + c.durationSeconds, 0);
  
  const handleAddClips = (newClips: Clip[]) => {
    const maxOrder = sequence.length > 0 ? Math.max(...sequence.map(s => s.order)) : 0;
    const newItems: VideoSequenceItem[] = newClips.map((clip, index) => ({
      clipId: clip.id,
      order: maxOrder + index + 1,
    }));
    onChange([...sequence, ...newItems]);
  };
  
  const handleRemove = (clipId: string) => {
    const newSequence = sequence.filter(s => s.clipId !== clipId);
    onChange(newSequence.map((item, index) => ({ ...item, order: index + 1 })));
  };
  
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSequence = [...sequenceClips];
    [newSequence[index - 1], newSequence[index]] = [newSequence[index], newSequence[index - 1]];
    onChange(newSequence.map((clip, i) => {
      const origItem = sequence.find(s => s.clipId === clip.id);
      return { clipId: clip.id, order: i + 1, interstitial: origItem?.interstitial };
    }));
  };
  
  const handleMoveDown = (index: number) => {
    if (index === sequenceClips.length - 1) return;
    const newSequence = [...sequenceClips];
    [newSequence[index], newSequence[index + 1]] = [newSequence[index + 1], newSequence[index]];
    onChange(newSequence.map((clip, i) => {
      const origItem = sequence.find(s => s.clipId === clip.id);
      return { clipId: clip.id, order: i + 1, interstitial: origItem?.interstitial };
    }));
  };

  const handleToggleInterstitial = (clipId: string, enabled: boolean) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId) return item;
      return {
        ...item,
        interstitial: enabled ? { ...DEFAULT_INTERSTITIAL, options: [
          { id: crypto.randomUUID(), text: '', isCorrect: true },
          { id: crypto.randomUUID(), text: '', isCorrect: false },
        ] } : undefined,
      };
    }));
  };

  const handleUpdateInterstitial = (clipId: string, updates: Partial<InterstitialQuiz>) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId || !item.interstitial) return item;
      return { ...item, interstitial: { ...item.interstitial, ...updates } };
    }));
  };

  const handleUpdateOption = (clipId: string, optionId: string, updates: Partial<QuizOption>) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId || !item.interstitial) return item;
      return {
        ...item,
        interstitial: {
          ...item.interstitial,
          options: item.interstitial.options.map(opt =>
            opt.id === optionId ? { ...opt, ...updates } : opt
          ),
        },
      };
    }));
  };

  const handleSetCorrectOption = (clipId: string, optionId: string) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId || !item.interstitial) return item;
      return {
        ...item,
        interstitial: {
          ...item.interstitial,
          options: item.interstitial.options.map(opt => ({
            ...opt,
            isCorrect: opt.id === optionId,
          })),
        },
      };
    }));
  };

  const handleAddOption = (clipId: string) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId || !item.interstitial || item.interstitial.options.length >= 4) return item;
      return {
        ...item,
        interstitial: {
          ...item.interstitial,
          options: [...item.interstitial.options, { id: crypto.randomUUID(), text: '', isCorrect: false }],
        },
      };
    }));
  };

  const handleRemoveOption = (clipId: string, optionId: string) => {
    onChange(sequence.map(item => {
      if (item.clipId !== clipId || !item.interstitial || item.interstitial.options.length <= 2) return item;
      const newOptions = item.interstitial.options.filter(opt => opt.id !== optionId);
      // If we removed the correct option, make the first one correct
      if (!newOptions.some(o => o.isCorrect) && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }
      return {
        ...item,
        interstitial: { ...item.interstitial, options: newOptions },
      };
    }));
  };
  
  const handleSaveNewClip = async (clip: Omit<Clip, 'id' | 'createdAt' | 'updatedAt'>) => {
    const saved = await saveClipMutation.mutateAsync(clip);
    if (saved) {
      handleAddClips([saved]);
    }
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Build your video sequence by adding clips from your library. Clips will play seamlessly in order.
        </p>
        <Button onClick={() => setPickerOpen(true)} size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Add from Library
        </Button>
      </div>
      
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Film className="w-4 h-4" />
            Video Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : sequenceClips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              <Film className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">No clips added yet</p>
              <p className="text-xs">Click "Add from Library" to start building your sequence</p>
            </div>
          ) : (
            <>
              {sequenceClips.map((clip, index) => {
                const isLast = index === sequenceClips.length - 1;
                const seqItem = sequence.find(s => s.clipId === clip.id);
                const hasInterstitial = !!seqItem?.interstitial;
                const isExpanded = expandedQuiz === clip.id;

                return (
                  <div key={clip.id} className="space-y-0">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{clip.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{clip.url}</p>
                      </div>
                      <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">
                        {formatDuration(clip.durationSeconds)}
                      </span>
                      <div className="flex items-center gap-1">
                        {!isLast && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedQuiz(isExpanded ? null : clip.id)}
                            className={`h-8 w-8 p-0 ${hasInterstitial ? 'text-primary' : ''}`}
                            title="Quiz settings"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleMoveUp(index)} disabled={index === 0} className="h-8 w-8 p-0">
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleMoveDown(index)} disabled={isLast} className="h-8 w-8 p-0">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemove(clip.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Interstitial Quiz Editor */}
                    {!isLast && isExpanded && (
                      <div className="ml-10 mr-2 p-4 border border-border border-t-0 rounded-b-lg bg-secondary/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Add quiz after this clip</Label>
                          <Switch
                            checked={hasInterstitial}
                            onCheckedChange={(checked) => handleToggleInterstitial(clip.id, checked)}
                          />
                        </div>

                        {hasInterstitial && seqItem?.interstitial && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs">Question</Label>
                              <Input
                                value={seqItem.interstitial.question}
                                onChange={(e) => handleUpdateInterstitial(clip.id, { question: e.target.value })}
                                placeholder="e.g. What did you learn about traffic generation?"
                                className="mt-1"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Answer Options (mark the correct one)</Label>
                              <RadioGroup
                                value={seqItem.interstitial.options.find(o => o.isCorrect)?.id || ''}
                                onValueChange={(val) => handleSetCorrectOption(clip.id, val)}
                              >
                                {seqItem.interstitial.options.map((opt) => (
                                  <div key={opt.id} className="flex items-center gap-2">
                                    <RadioGroupItem value={opt.id} id={opt.id} />
                                    <Input
                                      value={opt.text}
                                      onChange={(e) => handleUpdateOption(clip.id, opt.id, { text: e.target.value })}
                                      placeholder="Answer text"
                                      className="flex-1"
                                    />
                                    {seqItem.interstitial.options.length > 2 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveOption(clip.id, opt.id)}
                                        className="h-8 w-8 p-0 text-destructive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </RadioGroup>
                              {seqItem.interstitial.options.length < 4 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddOption(clip.id)}
                                  className="gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Option
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Correct Feedback</Label>
                                <Input
                                  value={seqItem.interstitial.correctFeedback}
                                  onChange={(e) => handleUpdateInterstitial(clip.id, { correctFeedback: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Wrong Feedback</Label>
                                <Input
                                  value={seqItem.interstitial.wrongFeedback}
                                  onChange={(e) => handleUpdateInterstitial(clip.id, { wrongFeedback: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs">Auto-advance delay (seconds)</Label>
                              <Input
                                type="number"
                                min={1}
                                max={30}
                                value={seqItem.interstitial.autoAdvanceSeconds}
                                onChange={(e) => handleUpdateInterstitial(clip.id, { autoAdvanceSeconds: parseInt(e.target.value) || 3 })}
                                className="mt-1 w-24"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm font-medium">Total Duration:</span>
                <span className="text-sm font-mono font-bold text-primary">
                  {formatDuration(totalDuration)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <ClipPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddClips}
        onCreateNew={() => {
          setPickerOpen(false);
          setAddModalOpen(true);
        }}
        excludeIds={clipIds}
      />
      
      <AddClipModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveNewClip}
      />
    </div>
  );
}
