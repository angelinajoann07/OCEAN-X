import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import {viteSingleFile} from 'vite-plugin-singlefile';
// singlefile: `npm run build` emits ONE dist/index.html with JS+CSS+three.js inlined -> works offline, double-click to open.
export default defineConfig({plugins:[react(),viteSingleFile()],base:'./'});
