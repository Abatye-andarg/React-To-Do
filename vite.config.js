import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //  server: {
  //   host: '10.3.0.113',
  //   port: 5173         
  //  }
})

