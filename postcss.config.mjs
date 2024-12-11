/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-nested': {}, // CSS 嵌套插件
    tailwindcss: {}, // Tailwind CSS 插件
    autoprefixer: {}, // 自动前缀
  },
}

export default config
