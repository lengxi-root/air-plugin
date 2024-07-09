import fs from 'node:fs'
import mkcfg from './lib/config.js'
import { dirPath } from './lib/tool.js'
//输出提示
logger.info(logger.yellow("- 正在加载 air-plugin "))
await mkcfg('config', {
  tips:'',
  Ark: true,
  chat: {
    user_id: "",
    appid: '',
    token: ''
  },
}, { 
  tips: [
    'Ark: 是否使用卡片回复，官方机器人专用，野生机器人请填false',
    'chat功能需要在腾讯元器申请智能体：https://yuanqi.tencent.com/',
    'user_id: 智能体用户id，在调用示例里面查看user_id',
    'appid: 智能体id, token: 智能体token'
  ]
})
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