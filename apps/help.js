import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from "../../../lib/puppeteer/puppeteer.js";

const _path = process.cwd().replace(/\\/g, "/");
const helpList =
{
  "helpname": "AIR帮助",
  "doc": "Ver：1.0.0",
  "group": "指令列表 前缀/和#都可以触发",
  "list": [
    {
      "icon": 1,
      "title": "/今日伊蕾娜",
      "desc": "每日一张伊蕾娜质量图和幸运值"
    },
    {
      "icon": 2,
      "title": "/随机伊蕾娜",
      "desc": "随机一张伊蕾娜图片"
    },
    {
      "icon": 3,
      "title": "/表情伊蕾娜",
      "desc": "随机一张表情包伊蕾娜"
    },
    {
      "icon": 4,
      "title": "/CE+对话",
      "desc": "跟智能体对话"
    },
  ],
};




export class help extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'air帮助',
            /** 功能描述 */
            dsc: 'air帮助',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 999,
            rule: [
                {
                    reg: '^(#|/)?(air|AIR)(帮助|菜单|功能)?$',
                    fnc: 'help'
                }
            ]
        })
    }


    async help(e) {
        let data = {
            tplFile: _path + '/plugins/air-plugin/main/helps/help.html',
            pluResPath: _path,
            helpname: helpList.helpname,
            doc: helpList.doc,
            helpList
        }
        let img = await puppeteer.screenshot("help", data);
        e.reply(img)
        return true
    }

}