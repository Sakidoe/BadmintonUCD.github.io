declare module '*.mdx' {
  import type { ComponentType } from 'preact';
  const MDXContent: ComponentType<{ components?: Record<string, unknown> }>;
  export const frontmatter: Record<string, unknown> | undefined;
  export default MDXContent;
}
