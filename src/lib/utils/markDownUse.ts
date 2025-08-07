import 'katex/dist/katex.min.css'
import mk from 'markdown-it-katex'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(mk)

// 表格渲染规则
md.renderer.rules.table_open = () => '<table><tbody>'
md.renderer.rules.table_close = () => '</tbody></table>'
md.renderer.rules.thead_open = () => ''
md.renderer.rules.thead_close = () => ''
md.renderer.rules.tfoot_open = () => ''
md.renderer.rules.tfoot_close = () => ''
md.renderer.rules.tbody_open = () => ''
md.renderer.rules.tbody_close = () => ''
md.renderer.rules.th_open = () => '<td>'
md.renderer.rules.th_close = () => '</td>'

// 自定义表格渲染
md.renderer.rules.table = function (tokens: any[], idx: number) {
  const token = tokens[idx]
  const rows = token?.children?.filter((t: any) => t.type === 'tr_open')

  let result = '<table><tbody>'

  rows?.forEach((row: any, rowIndex: number) => {
    result += '<tr>'
    const cells = row?.children?.filter(
      (t: any) => t.type === 'th_open' || t.type === 'td_open'
    )

    cells?.forEach((cell: any, cellIndex: number) => {
      const content = cell.content || ''
      const tag = cell.type === 'th_open' ? 'th' : 'td'
      const colspan = cellIndex === 1 && rowIndex === 0 ? 'colspan="3"' : ''
      result += `<${tag} ${colspan}>${content}</${tag}>`
    })

    result += '</tr>'
  })

  return result + '</tbody></table>'
}

// 自定义渲染 img 节点，加入初始的宽高
md.renderer.rules.image = function (tokens: any[], idx: number) {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.content || ''

  // 从 token 中获取图片的宽高（如果存在）
  let width = token.attrGet('width')
  let height = token.attrGet('height')

  // 如果没有宽高属性，则设置默认宽高
  if (!width) {
    width = 300 // 设置默认宽度
  }

  if (!height) {
    height = 200 // 设置默认高度
  }

  // 返回带有宽高的 img 标签
  return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" />`
}

export default md

// 导出基础实例（兼容旧用法）
// export const baseMarkdown = createBaseMarkdown();

// type RuleHandler = (tokens: any[], idx: number) => string;

// export const useStyledMarkdown = () => {
//   const { globalTextCss } = useModel('public');

//   return useMemo(() => {
//     const md = baseMarkdown;

//     // 样式处理函数
//     const getStyleString = (tag: string) => {
//       const styles = globalTextCss?.[tag.toLowerCase()] || {};

//       return Object.entries(styles)
//         .map(([key, value]) => {
//           // 规范化CSS属性名
//           const prop = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

//           // 特殊处理font-family属性
//           if (prop === 'font-family') {
//             return `${prop}: ${processFontFamily(value as string)};`;
//           }

//           // 通用值处理
//           return `${prop}: ${sanitizeStyleValue(value as string)};`;
//         })
//         .join(' ')
//         .replace(/; /g, '; ') // 标准化分隔符
//         .replace(/;+$/, '');  // 移除结尾分号
//     };

//     // 字体处理专用函数
//     const processFontFamily = (fontString: string) => {
//       return fontString
//         .split(',')
//         .map(font => {
//           // 清理前后空格
//           const cleaned = font.trim();
//           // 检测需要引号包裹的字体名
//           return /[\s"']/.test(cleaned)
//             ? `'${cleaned.replace(/'/g, '').replace(/"/g, '')}'`
//             : cleaned;
//         })
//         .join(', ');
//     };

//     // 通用样式值处理
//     const sanitizeStyleValue = (value: string) => {
//       // 处理特殊字符（分号需转义）
//       return value
//         .replace(/;/g, '\\;') // 转义分号
//         .replace(/'/g, '\\\'') // 转义单引号
//         .replace(/"/g, '\\"'); // 转义双引号
//     };

//     // 创建样式规则
//     const createStyledRule = (original: RuleHandler, tag: string): RuleHandler => {
//       return (tokens, idx) => {
//         const style = getStyleString(tag);
//         return style
//           ? `<${tag}><span style="${style}">`
//           : original?.(tokens, idx)||'';
//       };
//     };

//     // 应用标题样式（h1-h6）
//     for (let level = 1; level <= 6; level++) {
//       const tag = `h${level}`;
//       if(getStyleString(tag) ){
//         md.renderer.rules[`${tag}_open`] = createStyledRule(
//           md.renderer.rules[`${tag}_open`] as RuleHandler,
//           tag
//         );

//         md.renderer.rules[`${tag}_close`] = (tokens, idx) => {
//           return getStyleString(tag)
//             ? `</span></${tag}>`
//             : `</${tag}>`;
//         };
//       }

//     }

//     // 应用段落样式
//     md.renderer.rules.paragraph_open = createStyledRule(
//       md.renderer.rules.paragraph_open as RuleHandler,
//       'p'
//     );
//     md.renderer.rules.paragraph_close = () => {
//       return getStyleString('p')
//         ? '</span></p>'
//         : '</p>';
//     };
//     console.log(globalTextCss)
//     return md;
//   }, [globalTextCss]);
// };
