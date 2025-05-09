import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
export default defineConfig({
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      '@': '/src', // 配置 '@' 别名指向项⽬根⽬录下的 src ⽂件夹
    },
  },
});
