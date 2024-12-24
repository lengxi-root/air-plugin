import { makeBtn } from '../lib/button.js';

export default class Button {
  constructor() {
    this.plugin = {
      name: "按钮中心",
      dsc: "按钮中心",
      priority: 100,
      rule: [
        {
          reg: '^#按钮中心$',
          fnc: 'buttonCenter'
        }
      ]
    }
  }
  buttonCenter(){
    let button = []
    let list = []
    list = [
      { label: '原神绑定', data: `/原神绑定` },
      { label: '扫码登录', data: `/扫码登录` }, 
      { label: '星铁绑定', data: `/星铁绑定` },
    ]
    button.push(...toButton(list,3))

    list = [
      { label: '修仙', callback: `/修仙` },
      { label: '抽卡', callback: `/抽卡` },
      { label: '链接', callback: `/链接` },
      { label: '求签', callback: `/求签` },
    ]
    button.push(...makeBtn(list,4))

    list = [
      { label: '原神面板', data: `/原神更新面板` },
      { label: '星铁面板', data: `/星铁更新面板` },
      { label: '轻量游戏', callback: `小游戏菜单` },
            
      { label: '米社签到', data: `/米游社全部签到` },
      { label: '使用教程', callback: `说：“必须@我才可以收到消息哦，复制和其它收不到的。\r发送/可唤出我。\r#是原神指令，*是星铁指令。\r有问题点击'反馈问题'询问”` },
      { label: '机器人公告', callback: `机器人公告` },
    ]
    button.push(...makeBtn(list,3))

    list = [
      { label: '添加我', data: `https://qun.qq.com/qunpro/robot/qunshare?robot_uin=3889002097&robot_appid=102077936`, ActionType: `0` },
      { label: '赞助我', data: `https://afdian.net/a/QQBot`, ActionType: `0` },
      { label: '反馈问题', data: `https://qm.qq.com/q/nQbNKf0JaM`, ActionType: `0` },
    ]
    button.push(...toButton(list,3))

    return button
  }
}

function toButton(list, line = 3) {
    let button = []
    let arr = []
    let index = 1
    for (const i of list) {
      arr.push({
        id: String(Date.now()),
        render_data: {
          label: i.label,
          style: i.style || 1
        },
        action: {
          type: i.ActionType || 2,
          permission: { type: 2 },
          data: i.data || i.label,
          enter: i.enter || false,
          unsupport_tips: "code: 45",
        }
      })
      if (index % line == 0 || index == list.length) {
        button.push({type: 'button',
          buttons: arr
        })
        arr = []
      }
      index++
    }
    return button
  }