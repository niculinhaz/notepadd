// react-native-html-to-markdown.d.ts

declare module "@vimeiro-co/react-native-html-to-markdown" {
  export interface ConvertOptions {}

  /**
   * Converte uma string HTML em Markdown.
   * @param html — string contendo HTML válido
   * @param options — (opcional) opções de conversão
   * @returns string em Markdown
   */
  export function convert(html: string, options?: ConvertOptions): string;

  export function use(transformer: (html: string) => string): void;

  export default { convert, use };
}
