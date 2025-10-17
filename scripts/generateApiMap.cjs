/* eslint-disable @typescript-eslint/no-require-imports */
/* scripts/generateApiMap.js */
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const apiDir = path.join(process.cwd(), 'src/app/api')
const outputFile = path.join(process.cwd(), 'src/lib/apiMap.ts')
const watchMode = process.argv.includes('--watch')

const httpMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']

// 遍历目录，找到 route.ts
function walkDir(dir) {
  let files = []
  for (const f of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, f)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath))
    } else if (stat.isFile() && f === 'route.ts') {
      files.push(fullPath)
    }
  }
  return files
}

// 获取 route.ts 文件里实际导出的 HTTP 方法
function getHttpMethods(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return httpMethods.filter((method) => {
    const regex = new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\(`,
      'i'
    )
    return regex.test(content)
  })
}

// 生成 apiMap.ts
function generate() {
  const routeFiles = walkDir(apiDir)
  let content = `/* eslint-disable */\n// ⚙️ 自动生成文件，请勿手动修改\n\n`

  // 声明全局函数，避免 TS 报错
  content += `// Minimal declarations for ReturnType usage\n`
  httpMethods.forEach((m) => {
    content += `declare function ${m}(...args: any[]): Promise<{ data: any }>;\n`
  })

  content += '\nexport interface ApiMap {\n'

  routeFiles.forEach((file) => {
    const relPath = file
      .replace(apiDir, '')
      .replace(/\\/g, '/')
      .replace(/\/route\.ts$/, '')
      .replace(/^\//, '') // 去掉开头斜杠

    const pathKey = '/' + relPath
    const methods = getHttpMethods(file)

    if (methods.length === 0) return

    content += `  '${pathKey}': {\n`
    methods.forEach((method) => {
      content += `    ${method}: Awaited<ReturnType<typeof ${method}>>['data'];\n`
    })
    content += '  };\n'
  })

  content += '}\n'

  fs.writeFileSync(outputFile, content)
  console.log(`✅ ApiMap 已更新，共发现 ${routeFiles.length} 个接口`)
}

generate()

if (watchMode) {
  console.log('👀 正在监听 src/app/api 目录变化...')
  chokidar
    .watch(apiDir, { ignoreInitial: true })
    .on('all', (event, changedPath) => {
      console.log(`🔄 检测到 ${event} 变化: ${changedPath}`)
      generate()
    })
}
