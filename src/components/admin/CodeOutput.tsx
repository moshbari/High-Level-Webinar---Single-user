import { useState } from 'react';
import { WebinarConfig } from '@/types/webinar';
import { generateEmbedCode } from '@/lib/generateEmbedCode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodeOutputProps {
  webinar: WebinarConfig;
}

export function CodeOutput({ webinar }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const code = generateEmbedCode(webinar);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Embed code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Code className="w-5 h-5 text-primary" />
            Generated Embed Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={handleCopy} className="glow-button">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={handlePreview}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview in New Tab
            </Button>
          </div>

          <div className="relative">
            <pre className="bg-secondary/50 rounded-xl p-4 overflow-x-auto text-sm text-muted-foreground max-h-[400px] overflow-y-auto">
              <code>{code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">How to Embed in GoHighLevel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-3">
            <li>Copy the embed code above using the "Copy Code" button</li>
            <li>Go to your GoHighLevel funnel/website builder</li>
            <li>Add a new "Custom HTML/CSS" or "Code" element</li>
            <li>Paste the entire code into the element</li>
            <li>Save and publish your page</li>
          </ol>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="font-medium text-foreground mb-2">💡 Pro Tip</p>
            <p>For best results, use the embed code in a full-width section or dedicated page for an immersive webinar experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
