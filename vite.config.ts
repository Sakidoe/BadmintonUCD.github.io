import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

/**
 * Multi-page setup. Every HTML file at the project root is a page.
 * To add a page: create `newpage.html` at the root, add it here,
 * and add a link in `src/data/site.ts` (nav) if it should be in the nav bar.
 */
const pages = ['index', 'about', 'events', 'board', 'join', 'fall-open', 'event'];

export default defineConfig({
  plugins: [
    // Event pages are written in MDX (src/content/events/*.mdx) and rendered with Preact.
    mdx({
      jsxImportSource: 'preact',
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
    }),
  ],
  // Custom domain (ucdavisbadminton.com) is served from the root.
  base: '/',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p, resolve(__dirname, `${p}.html`)]),
      ),
    },
  },
});
