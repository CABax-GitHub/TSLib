export function getCurrentBrowserLanguage(defaultLanguage: string): string {
  return navigator.language || defaultLanguage;
}
