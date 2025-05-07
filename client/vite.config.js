import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // 配置 '@' 别名指向项⽬根⽬录下的 src ⽂件夹
    },
  },
});
