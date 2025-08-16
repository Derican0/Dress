import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(process.cwd(), "./Clothing Shopping & Rental Web App"),
        },
    },
    root: "./Clothing Shopping & Rental Web App",
    publicDir: "../public",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
})
