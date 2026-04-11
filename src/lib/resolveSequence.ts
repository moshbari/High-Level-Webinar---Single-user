import { supabase } from '@/integrations/supabase/client';
import { WebinarConfig } from '@/types/webinar';
import { ResolvedSequenceClip } from '@/types/clip';

export async function resolveSequence(config: WebinarConfig): Promise<ResolvedSequenceClip[]> {
  if (config.videoMode !== 'multi' || !config.videoSequence || config.videoSequence.length === 0) {
    return [];
  }

  const clipIds = config.videoSequence.map(s => s.clipId);
  const { data: clips } = await supabase
    .from('clips')
    .select('id, name, url, duration_seconds')
    .in('id', clipIds);

  if (!clips) return [];

  return config.videoSequence
    .sort((a, b) => a.order - b.order)
    .map(item => {
      const clip = clips.find(c => c.id === item.clipId);
      if (!clip) return null;
      return {
        url: clip.url,
        name: clip.name,
        durationSeconds: clip.duration_seconds,
        interstitial: item.interstitial || null,
      };
    })
    .filter((c): c is ResolvedSequenceClip => c !== null);
}
