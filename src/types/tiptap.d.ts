import "@tiptap/core";

/**
 * `tiptap-markdown` registers itself on the editor storage at runtime but ships
 * no declaration for it, so the accessor is typed here.
 */
declare module "@tiptap/core" {
  interface Storage {
    markdown: {
      getMarkdown: () => string;
    };
  }
}
