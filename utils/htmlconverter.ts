export const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Manter nbps
  html = html.replace(/&nbsp;/g, '___NBSP___');
  
  // Caracteres de escape HTML
  html = html.replace(/&/g, '&amp;');
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');
  
  // Restaurar &nbsp protegidos
  html = html.replace(/___NBSP___/g, '&nbsp;');
  
  // Code blocks (blocos de código)
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code (código inline)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Headers (cabeçalhos)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  
  // Horizontal rule (linha horizontal)
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  
  // Bold (negrito)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic (itálico)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Strikethrough (tachado)
  html = html.replace(/~~(.+?)~~/g, '<strike>$1</strike>');
  
  // Images (imagens - não implementado)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  
  // Links (links - não implementado)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Blockquotes (citações)
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Unordered lists (listas não ordenadas)
  const ulRegex = /^[-*+]\s+(.+)$/gm;
  let inUl = false;
  html = html.replace(ulRegex, (match, item) => {
    if (!inUl) {
      inUl = true;
      return '<ul><li>' + item + '</li>';
    }
    return '<li>' + item + '</li>';
  });
  if (inUl) {
    html = html.replace(/(<\/li>)(?![\s\S]*<li>)/g, '$1</ul>');
  }
  
  // Ordered lists (listas ordenadas)
  const olRegex = /^\d+\.\s+(.+)$/gm;
  let inOl = false;
  html = html.replace(olRegex, (match, item) => {
    if (!inOl) {
      inOl = true;
      return '<ol><li>' + item + '</li>';
    }
    return '<li>' + item + '</li>';
  });
  if (inOl) {
    html = html.replace(/(<\/li>)(?![\s\S]*<li>)/g, '$1</ol>');
  }
  
  // Paragraphs (parágrafos) - processar por blocos separados por linhas vazias
  const blocks = html.split(/\n\n+/); // Separa por 2+ quebras de linha
  let result = [];
  
  for (let block of blocks) {
    const trimmedBlock = block.trim();
    
    if (!trimmedBlock) continue;
    
    // Não envolve em <p> se já é uma tag de bloco
    const isBlockElement = /^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/.test(trimmedBlock);
    
    if (isBlockElement) {
      result.push(trimmedBlock);
    } else {
      // Dentro de um parágrafo, quebras de linha simples viram <br>
      const lines = trimmedBlock.split('\n');
      const content = lines.join('<br>');
      result.push('<p>' + content + '</p>');
    }
  }
  
  html = result.join('');
  
  // Converter múltiplos espaços em &nbsp; para preservar formatação
  html = html.replace(/  +/g, (match) => {
    return '&nbsp;'.repeat(match.length);
  });
  
  return html;
};
