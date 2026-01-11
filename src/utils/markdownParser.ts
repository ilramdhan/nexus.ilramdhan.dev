/**
 * Simple markdown to terminal-style text converter
 * Converts common markdown syntax to terminal-friendly output
 */

interface ParsedLine {
    content: string;
    indent?: number;
}

/**
 * Convert markdown text to array of terminal-friendly lines
 */
export function parseMarkdownToTerminal(markdown: string): string[] {
    if (!markdown) return [];

    const lines: string[] = [];
    const rawLines = markdown.split('\n');

    for (const line of rawLines) {
        const trimmed = line.trim();

        // Skip empty lines or add spacing
        if (!trimmed) {
            lines.push('');
            continue;
        }

        // Headers - convert to styled text
        if (trimmed.startsWith('### ')) {
            lines.push(`── ${trimmed.slice(4).toUpperCase()} ──`);
            continue;
        }
        if (trimmed.startsWith('## ')) {
            lines.push(`━━ ${trimmed.slice(3).toUpperCase()} ━━`);
            continue;
        }
        if (trimmed.startsWith('# ')) {
            lines.push(`═══ ${trimmed.slice(2).toUpperCase()} ═══`);
            continue;
        }

        // Code blocks - preserve as-is with indicator
        if (trimmed.startsWith('```')) {
            lines.push('┌── code ──');
            continue;
        }

        // Horizontal rules
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            lines.push('────────────────────────────────');
            continue;
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
            lines.push(`│ ${trimmed.slice(2)}`);
            continue;
        }

        // Unordered lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            lines.push(`  • ${parseInlineMarkdown(trimmed.slice(2))}`);
            continue;
        }

        // Ordered lists
        const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (orderedMatch) {
            lines.push(`  ${orderedMatch[1]}. ${parseInlineMarkdown(orderedMatch[2])}`);
            continue;
        }

        // Regular text with inline formatting
        lines.push(parseInlineMarkdown(trimmed));
    }

    return lines;
}

/**
 * Parse inline markdown elements (bold, italic, links, code)
 */
function parseInlineMarkdown(text: string): string {
    let result = text;

    // Bold **text** or __text__ -> *text* (terminal style)
    result = result.replace(/\*\*(.+?)\*\*/g, '【$1】');
    result = result.replace(/__(.+?)__/g, '【$1】');

    // Italic *text* or _text_ -> _text_
    result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '_$1_');
    result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, '_$1_');

    // Inline code `code` -> [code]
    result = result.replace(/`([^`]+)`/g, '[$1]');

    // Links [text](url) -> text (url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 → $2');

    // Images ![alt](url) -> [Image: alt]
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[Image: $1]');

    // Strikethrough ~~text~~ -> -text-
    result = result.replace(/~~(.+?)~~/g, '-$1-');

    return result;
}

/**
 * Convert markdown to a single formatted string for display
 */
export function markdownToTerminalString(markdown: string): string {
    return parseMarkdownToTerminal(markdown).join('\n');
}

/**
 * Truncate markdown content smartly (at paragraph boundaries)
 */
export function truncateMarkdown(markdown: string, maxLength: number = 500): string {
    if (!markdown || markdown.length <= maxLength) return markdown;

    // Try to cut at paragraph break
    const truncated = markdown.slice(0, maxLength);
    const lastParagraph = truncated.lastIndexOf('\n\n');
    const lastNewline = truncated.lastIndexOf('\n');

    if (lastParagraph > maxLength * 0.5) {
        return truncated.slice(0, lastParagraph) + '\n\n...';
    } else if (lastNewline > maxLength * 0.7) {
        return truncated.slice(0, lastNewline) + '\n...';
    }

    return truncated + '...';
}
