import fs from 'fs'
import moment from 'moment'
import chokidar from 'chokidar'
import { basename } from './dir.js'

class Button {
  constructor () {
    this.plugin = './plugins'
    this.botModules = []
    this.initialize()
  }

  /** 加载按钮 */
  async loadModule (filePath) {
    filePath = filePath.replace(/\\/g, '/')
    try {
      let Plugin = (await import(`../../.${filePath}?${moment().format('x')}`)).default
      Plugin = new Plugin()
      Plugin.plugin._path = filePath
      this.botModules.push(Plugin)
      /** 排序 */
      this.botModules.sort((a, b) => a.plugin.priority - b.plugin.priority)
      logger.debug(`按钮模块 ${filePath} 已加载。`)
    } catch (error) {
      logger.error(`导入按钮模块 ${filePath} 时出错：${error.message}`)
    }
  }

  /** 卸载指定文件路径的模块 */
  unloadModule (filePath) {
    const index = this.botModules.findIndex(module => module.plugin._path === filePath)
    if (index !== -1) this.botModules.splice(index, 1)
    /** 排序 */
    this.botModules.sort((a, b) => a.plugin.priority - b.plugin.priority)
  }

  /**
   * 处理文件变化事件
   * @param {string} filePath - 文件路径
   * @param {string} eventType - 事件类型 ('add', 'change', 'unlink')
   */
  async handleFileChange (filePath, eventType, state) {
    filePath = './' + filePath.replace(/\\/g, '/')
    if (filePath.endsWith('.js')) {
      if (eventType === 'add') {
        this.unloadModule(filePath)
        await this.loadModule(filePath)
        if (!state) logger.mark(`[${basename}][新增按钮插件][${filePath}]`)
      } else if (eventType === 'add' || eventType === 'change') {
        this.unloadModule(filePath)
        await this.loadModule(filePath)
        logger.mark(`[${basename}][修改按钮插件][${filePath}]`)
      } else if (eventType === 'unlink') {
        this.unloadModule(filePath)
        logger.mark(`[${basename}][卸载按钮插件][${filePath}]`)
      }
    }
  }

  /** 初始化 */
  async initialize () {
    try {
      const filesList = []

      /** 获取按钮插件包内的文件夹，进行热更 */
      const pluginList = fs.readdirSync(this.plugin + `/${basename}/button`)
      /** 支持按钮插件包按钮 */
      for (let folder of pluginList) {
        const folderPath = this.plugin + `/${basename}/button/${folder}`
        /** 检查是否为文件夹 */
        if (fs.lstatSync(folderPath).isDirectory()) continue
        /** 保存 */
        filesList.push(folderPath)
      }

      /** 热更新 */
      filesList.map(folder => {
        let state = true
        const watcher = chokidar.watch(folder, { ignored: /[\/\\]\./, persistent: true })
        // const watcher = chokidar.watch(folder)
        watcher
          .on('add', async filePath => {
            await this.handleFileChange(filePath, 'add', state)
            if (state) state = false
          })
          .on('change', async filePath => await this.handleFileChange(filePath, 'change'))
          .on('unlink', async filePath => await this.handleFileChange(filePath, 'unlink'))

        return watcher
      })

      return this.botModules
    } catch (error) {
      logger.error(`读取按钮插件目录时出错：${error.message}`)
    }
  }
}

const plugin = new Button()
export default plugin.botModules
/**
 * makeBtn 是一个函数，用于生成按钮列表。
 * @param {Array} list - 包含按钮信息的数组。每个对象可以有以下属性：
 *   @param {string} text - 按钮的显示文本。
 *   @param {number} style - 按钮的显示的颜色，0-灰色，1-蓝色。
 *   @param {string} data - 按钮的自定义回复内容。
 *   @param {boolean} send - 如果为 true，则直接发送内容。
 *   @param {boolean} admin - 如果为 true，则仅管理员可以点击此按钮。
 *   @param {Array} list - 包含有权限点击此按钮的用户 id 的数组。
 *   @param {Array} role - 包含有权限点击此按钮的用户组 id 的数组（仅频道可用）。
 *   @param {boolean} reply - 如果为 true，则点击后自动添加引用回复。
 *   @param {string} link - 按钮的 http 跳转链接。
 *   以上参数，均可自行组合。
 * @param {number} [line=3] - 按钮的行数。
 * @returns {Array} button - 返回包含按钮信息的数组。
 */
export function makeBtn(list, line = 3) {
  let id = 0
  let index = 1
  let arr = []
  let button = []

  for (let i of list) {

    /** 兼容单用户字符串表示permission */
    if (typeof i.permission === 'string') {
      i.list = [i.permission]
      i.permission = false
    }

    /** 处理用户id */
    if (i.list && i.list.length) {
      const list = []
      i.list.forEach(p => {
        p = p.split('-')
        p = p[1] || p[0]
        list.push(p)
      })
      i.list = list
    }

    /** 支持一维和二维数组表示按钮 */
    if (Array.isArray(i)) {
      button.push(...makeBtn(i, 10))
    } else {

      /** 构造单个按钮 */
      let Button = {
        id: String(id),
        render_data: {
          label: i.text || i.label || i.link,
          style: (i.style == 0) ? 0 : 1,
          visited_label: i.text || i.label || i.link
        },
        action: {
          type: i.type || (i.link ? 0 : 2),
          reply: i.reply || false,
          permission: i.permission || {
            type: (i.admin && 1) || (i.list && '0') || (i.role && 3) || 2,
            specify_user_ids: i.list || [],
            specify_role_ids: i.role || []
          },
          data: i.data || i.input || i.callback || i.link || i.text || i.label,
          enter: i.send || i.enter || 'callback' in i || false,
          unsupport_tips: i.tips || 'err'
        }
      }

      /** 兼容trss的QQBot字段 */
      if (i.QQBot) {
        if (i.QQBot.render_data) Object.assign(Button.render_data, i.QQBot.render_data)
        if (i.QQBot.action) Object.assign(Button.action, i.QQBot.action)
      }

      arr.push(Button)

      /** 构造一行按钮 */
      if (index % line == 0 || index == list.length) {
        button.push({
          type: 'button',
          buttons: arr
        })
        arr = []
      }

    }
    id++
    index++
  }
  return button
}
