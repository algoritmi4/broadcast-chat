export function parseHTML<T extends HTMLElement = HTMLElement>(
  html: string,
): T {
  const template = document.createElement('template');

  template.innerHTML = html.trim();

  return template.content.firstElementChild as T;
}
