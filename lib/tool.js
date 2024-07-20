import { dirPath, basename, pluginPath} from './dir.js'
import cfg from './xxCfg.js'

/** 插件包相对路径 */
export { dirPath, basename }

// 初始化 pluginPath
export { pluginPath }


const tool = {
  rows(data, btnid = 1) {
    let id = btnid
    const buttons = []
    if (!Array.isArray(data)) data = [data]
    for (const i of data) {
      // 按钮类型：0 跳转按钮，1 回调按钮，2 指令按钮 请开发者注意 这里需要为int类型
      const type = i.link ? 0 : (i.type ?? 2)

      const data = {
        id: String(id),
        render_data: {
          // 按钮上的文字
          label: i.text || i.link,
          // 按钮样式：0 灰色线框，1 蓝色线框
          style: i.style ?? 0,
          // 点击后按钮的上显示的文字
          visited_label: i.show || i.text || i.link,
        },
        action: {
          // 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data
          type,
          // 操作相关的数据
          data: i.data || i.link || i.text,
          // 客户端不支持本action的时候，弹出的toast文案
          unsupport_tips: i.tips || '.',
          // 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用）
          permission: { type: 2 },
        },
      }

      // 指令按钮可用，点击按钮后直接自动发送 data，默认 false。支持版本 8983
      if (i.enter) data.action.enter = true
      // 指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983
      if (i.reply) data.action.reply = true
      // 仅管理者可操作
      if (i.admin) data.action.permission.type = 1
      // 有权限的用户 id 的列表
      if (i.list) {
        i.action.permission.type = 0
        data.action.permission.specify_user_ids = i.list
      }
      // 有权限的身份组 id 的列表（仅频道可用）
      if (i.role) {
        i.action.permission.type = 3
        data.action.permission.specify_role_ids = i.role
      }

      buttons.push(data)

      // 递增
      id++
    }
    return { "buttons": buttons }
  },
  button(bt = []) {
    return segment.raw({ "type": "keyboard", 'content': { "appid": 1, "rows": bt } })
  },
  textobj(wx = "", bt = "") {
    return { "obj_kv": [{ "key": "desc", "value": wx }, { "key": "link", "value": bt }] }
  },
  textark(wx = "", obj = []) {
    return {
      "type": "ark",
      "template_id": 23,
      "kv": [
        {
          "key": "#DESC#",
          "value": "TSmoe"
        },
        {
          "key": "#PROMPT#",
          "value": wx
        },
        {
          "key": "#LIST#",
          "obj": obj
        }
      ]
    }

  },
  imgark(wx = "", bt = "", xbt = "", tp = "", url = "") {
    return { "type": "ark", "template_id": 37, "kv": [{ "key": "#PROMPT#", "value": wx }, { "key": "#METATITLE#", "value": bt }, { "key": "#METASUBTITLE#", "value": xbt }, { "key": "#METACOVER#", "value": tp }, { "key": "#METAURL#", "value": url }] }
  },
  at(qq, name) {
    return { type: "at", qq, name }
  },
  record(file, name) {
    return { type: "record", file, name }
  },
  video(file, name) {
    return { type: "video", file, name }
  },
  file(file, name) {
    return { type: "file", file, name }
  },
  reply(id, text, qq, time, seq) {
    return { type: "reply", id, text, qq, time, seq }
  },
}
 
export { tool }