export function parseHTML(html: string): Element {
  const template = document.createElement('template');

  template.innerHTML = html.trim();

  return template.content.firstElementChild!;
}
