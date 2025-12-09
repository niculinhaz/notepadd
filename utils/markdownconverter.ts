export const htmlToMarkdown = (html: string): string => {
    if (!html) return '';

    let markdown = html;

    // Entidades HTML (fazer antes de processar tags)
    markdown = markdown.replace(/&nbsp;/g, ' ');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    markdown = markdown.replace(/&apos;/g, "'");

    // Code blocks (processar ANTES de inline code para evitar conflitos)
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, (_, content) => {
        // Decodifica entidades HTML dentro do code block
        const decoded = content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"');
        return '\n```\n' + decoded.trim() + '\n```\n\n';
    });

    // Inline code (processar antes de outras formatações)
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Blockquote (processar antes de parágrafos)
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
        // Remove tags internas e processa o conteúdo
        const cleaned = content.replace(/<[^>]*>/g, '').trim();
        const lines = cleaned.split('\n').filter(line => line.trim());
        return '\n' + lines.map(line => `> ${line.trim()}`).join('\n') + '\n\n';
    });

    // Headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n\n');

    // Listas ordenadas (processar antes de remover <ol>)
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
        let counter = 0;
        const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, (__, itemContent) => {
            counter++;
            return `${counter}. ${itemContent.trim()}\n`;
        });
        return '\n' + items + '\n';
    });

    // Listas não ordenadas
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
        const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, (__, itemContent) => {
            return `- ${itemContent.trim()}\n`;
        });
        return '\n' + items + '\n';
    });

    // Links
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Imagens
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');

    // Formatação de texto
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    markdown = markdown.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
    markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
    markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');

    // Horizontal rule
    markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

    // Parágrafos
    markdown = markdown.replace(/<\/p>/gi, '\n\n');
    markdown = markdown.replace(/<p[^>]*>/gi, '');

    // Quebras de linha
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Remove divs e spans mantendo o conteúdo
    markdown = markdown.replace(/<\/div>/gi, '\n');
    markdown = markdown.replace(/<div[^>]*>/gi, '');
    markdown = markdown.replace(/<span[^>]*>/gi, '');
    markdown = markdown.replace(/<\/span>/gi, '');

    // Remove quaisquer tags HTML restantes
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Decodifica entidades HTML que possam ter sido adicionadas pelas tags
    markdown = markdown.replace(/&nbsp;/g, ' ');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");

    // Limpa espaços em branco excessivos
    markdown = markdown.replace(/ +/g, ' '); // Múltiplos espaços
    markdown = markdown.replace(/\n /g, '\n'); // Espaços no início de linhas
    markdown = markdown.replace(/ \n/g, '\n'); // Espaços no final de linhas
    markdown = markdown.replace(/\n{3,}/g, '\n\n'); // Múltiplas quebras de linha

    return markdown.trim();
};