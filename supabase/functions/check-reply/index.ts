import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, webinarId } = await req.json();

    if (!userEmail || !webinarId) {
      throw new Error('userEmail and webinarId are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Checking reply for ${userEmail} in webinar ${webinarId}`);

    // Find the session for this user
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id, mode')
      .eq('user_email', userEmail)
      .eq('webinar_id', webinarId)
      .eq('is_active', true)
      .single();

    if (!session) {
      return new Response(
        JSON.stringify({ hasReply: false, mode: 'ai' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if there's a pending reply that has been answered
    const { data: pendingReply } = await supabase
      .from('pending_replies')
      .select('human_response, is_answered')
      .eq('session_id', session.id)
      .eq('is_answered', true)
      .order('answered_at', { ascending: false })
      .limit(1)
      .single();

    if (pendingReply && pendingReply.human_response) {
      // Mark this reply as delivered by removing it or flagging
      // For now, just return the response
      return new Response(
        JSON.stringify({ 
          hasReply: true, 
          reply: pendingReply.human_response,
          mode: session.mode
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also check chat_messages for recently answered messages
    const { data: recentMessage } = await supabase
      .from('chat_messages')
      .select('ai_response, response_type, responded_at')
      .eq('session_id', session.id)
      .eq('response_type', 'human')
      .order('responded_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .single();

    if (recentMessage && recentMessage.ai_response) {
      // Check if this was responded within the last minute
      const respondedAt = new Date(recentMessage.responded_at);
      const now = new Date();
      const diffMs = now.getTime() - respondedAt.getTime();
      const diffSecs = diffMs / 1000;

      if (diffSecs < 60) {
        return new Response(
          JSON.stringify({ 
            hasReply: true, 
            reply: recentMessage.ai_response,
            mode: session.mode
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ hasReply: false, mode: session.mode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Check reply error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, hasReply: false }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
