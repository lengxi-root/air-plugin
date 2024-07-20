import path from 'path'
import { fileURLToPath } from 'url'

// 初始化 dirPath
const _path = process.cwd();
const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
const dirname = path.resolve(filePath, '../../')
const basename = path.basename(dirname)
const dirPath = './plugins/' + basename


/** 插件包相对路径 */
export { dirPath, basename }

// 初始化 pluginPath
const pluginPath = path.join(_path, dirPath);
export { pluginPath }