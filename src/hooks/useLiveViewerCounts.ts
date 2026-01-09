import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LiveViewerCount {
  webinar_id: string;
  webinar_name: string;
  live_count: number;
}

export const useLiveViewerCounts = (refreshInterval = 10000) => {
  return useQuery({
    queryKey: ['liveViewerCounts'],
    queryFn: async (): Promise<LiveViewerCount[]> => {
      // Get events from the last 24 hours to ensure we capture all active sessions
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Get all join events from last 24 hours
      const { data: joinEvents, error: joinError } = await supabase
        .from('webinar_events')
        .select('webinar_id, webinar_name, session_id')
        .eq('event_type', 'join')
        .gte('created_at', yesterday.toISOString());

      if (joinError) {
        console.error('Error fetching join events:', joinError);
        throw joinError;
      }

      // Get all leave events from last 24 hours
      const { data: leaveEvents, error: leaveError } = await supabase
        .from('webinar_events')
        .select('session_id')
        .eq('event_type', 'leave')
        .gte('created_at', yesterday.toISOString());

      if (leaveError) {
        console.error('Error fetching leave events:', leaveError);
        throw leaveError;
      }

      // Create a set of session IDs that have left
      const leftSessionIds = new Set((leaveEvents || []).map(e => e.session_id));

      // Filter join events to only those that haven't left
      const activeJoins = (joinEvents || []).filter(
        e => e.session_id && !leftSessionIds.has(e.session_id)
      );

      // Group by webinar_id and count unique sessions
      const webinarCounts = new Map<string, { webinar_name: string; sessions: Set<string> }>();
      
      activeJoins.forEach(event => {
        if (!event.webinar_id || !event.session_id) return;
        
        if (!webinarCounts.has(event.webinar_id)) {
          webinarCounts.set(event.webinar_id, {
            webinar_name: event.webinar_name || 'Unknown Webinar',
            sessions: new Set()
          });
        }
        webinarCounts.get(event.webinar_id)!.sessions.add(event.session_id);
      });

      // Convert to array format
      const result: LiveViewerCount[] = [];
      webinarCounts.forEach((value, webinar_id) => {
        result.push({
          webinar_id,
          webinar_name: value.webinar_name,
          live_count: value.sessions.size
        });
      });

      // Sort by count descending
      result.sort((a, b) => b.live_count - a.live_count);

      return result;
    },
    refetchInterval: refreshInterval,
    staleTime: 5000,
  });
};

export const useTotalLiveViewers = (refreshInterval = 5000) => {
  const { data: viewerCounts, ...rest } = useLiveViewerCounts(refreshInterval);
  
  const totalCount = viewerCounts?.reduce((sum, item) => sum + item.live_count, 0) || 0;
  
  return {
    totalCount,
    breakdown: viewerCounts || [],
    ...rest
  };
};
