/**
 * Converts simple markdown-like syntax to HTML:
 * - **bold** → <strong>bold</strong>
 * - *italic* → <em>italic</em>
 * - __underline__ → <u>underline</u>
 */
export function formatText(text: string): string {
  if (!text) return '';
  return text
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Underline: __text__ (must be before italic)
    .replace(/__(.+?)__/g, '<u>$1</u>')
    // Italic: *text*
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
