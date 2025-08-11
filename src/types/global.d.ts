type HTMLString = string & { __htmlBrand: true };

declare module '*.html' {
  const content: HTMLString;

  export default content;
}
