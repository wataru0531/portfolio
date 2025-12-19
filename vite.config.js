
import { defineConfig } from "vite";


export default defineConfig({
  server: {
    port: 3000, // 3000番でサーバーを立てる
    strictPort: true, // 3000 が使われていたら
                      // 勝手に 3001, 3002 に逃げず、エラーで止まる
    open: true,
    
  }
})

