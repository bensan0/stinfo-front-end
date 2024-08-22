import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path');

export default defineConfig({
    plugins: [vue()],
    // 其他 Vite 配置
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    }
})