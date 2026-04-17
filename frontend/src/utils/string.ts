/* 日本語文字列を正規化する */
export function normalizeJapanese(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u3041-\u3096]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) + 0x60)
    );
}