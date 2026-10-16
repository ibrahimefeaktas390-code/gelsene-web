// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gidelim.app',
  output: 'static',
  // /gizlilik → gizlilik.html: Cloudflare Pages bunu uzantısız, sonda "/" olmadan sunar.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
