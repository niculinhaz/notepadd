
export const htmlToMarkdown = (html: string) => {
    if (!html) return '';

    let markdown = html;

    // Nativos do HTML
    markdown = markdown.replace(/&nbsp;/g, '');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    markdown = markdown.replace(/&apos;/g, "'");

    // Quebras de linha
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
    markdown = markdown.replace(/<\/p>/gi, '\n\n');
    markdown = markdown.replace(/<p>/gi, '');

    // Headings (cabeçalhos)
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

    // Bold (negrito)
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

    // Italic (itálico)
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Strikethrough (tachado)
    markdown = markdown.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
    markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
    markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');

    // Links (não implementado)
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images (não implementado)
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

    // Unordered lists (listas não ordenadas)
    markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Ordered lists (listas ordenadas)
    let olCounter = 0;
    markdown = markdown.replace(/<ol[^>]*>/gi, () => {
        olCounter = 0;
        return '\n';
    });
    markdown = markdown.replace(/<\/ol>/gi, '\n');

    // Para listas ordenadas, precisa de um tratamento especial
    const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    markdown = markdown.replace(olRegex, (match, content) => {
        let counter = 0;
        const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
            counter++;
            return `${counter}. $1\n`;
        });
        return '\n' + items + '\n';
    });

    // Blockquote (citações)
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
        const lines = content.trim().split('\n');
        return '\n' + lines.map(line => `> ${line.trim()}`).join('\n') + '\n\n';
    });

    // Code blocks (blocos de código)
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Horizontal rule (linha horizontal)
    markdown = markdown.replace(/<hr[^>]*>/gi, '\n---\n\n');

    // Remove divs e spans mantendo o conteúdo
    markdown = markdown.replace(/<div[^>]*>/gi, '');
    markdown = markdown.replace(/<\/div>/gi, '\n');
    markdown = markdown.replace(/<span[^>]*>/gi, '');
    markdown = markdown.replace(/<\/span>/gi, '');

    // Remove outras tags HTML restantes
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Limpa múltiplas quebras de linha
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
};
