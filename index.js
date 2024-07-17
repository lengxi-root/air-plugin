import fs from 'node:fs'
import { dirPath } from './lib/tool.js'
//输出提示
logger.info(logger.yellow("- 正在加载 air-plugin "))
if (!fs.existsSync(`${dirPath}/config/air.config.yaml`)) {
  fs.copyFile(`${dirPath}/config_def/air/config.yaml`, `${dirPath}/config/air.config.yaml`, (err) => {
    if (err) throw err;
    logger.info(logger.yellow("- air-plugin 默认配置加载完成"))
  });
};
//加载插件
const files = fs.readdirSync(`${dirPath}/apps`).filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})


ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

logger.info(logger.green("- 加载 air-plugin 完成"))
export { apps }