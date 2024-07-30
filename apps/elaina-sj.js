import { segment } from "oicq";
import fetch from "node-fetch";
import { tool, basename, pluginPath } from '../lib/tool.js';
import cfg from '../lib/xxCfg.js'
const _path = process.cwd();
export class wallpaper extends plugin {
    constructor() {
        super({
            name: 'api伊蕾娜',
            dsc: 'api-elaina',
            event: 'message',
            priority: 500,
            rule: [
                {
                    reg: "^(#|/)随机伊蕾娜$",
                    fnc: 'sjelaina'
                },
                {
                    reg: "^(#|/)表情伊蕾娜$",
                    fnc: 'bqelaina'
                }
            ]
        })
    }

    async sjelaina(e) {
        let config = await cfg.getConfig('air', 'config')
        let Ark = config.Ark
        let msgurl = config.MsgUrl
        console.log("用户命令：", e.msg);
        let url = `https://vst.qqmsg.cn/api/esj`;
        let res = await fetch(url).catch((err) => logger.error(err));

        // 提取图片地址
        let imageUrl = res.url;
        let msg, tips, btn
        if (Ark) {
            msg = [segment.at(e.user_id), segment.image(imageUrl)]
            btn = [tool.button([
                tool.rows({ text: '再来一张', data: '#随机伊蕾娜', enter: true }),
                tool.rows({ text: '如未发送图片，点击查看', data: `${msgurl}${imageUrl}`, type: 0 })
            ])]
            await this.reply(btn)
            await this.reply(msg)
            return true

        }
        msg = [segment.at(e.user_id), segment.image(imageUrl)];// 图文回复
        await e.reply(`\n如未发送图片，点击链接查看：${msgurl}${imageUrl}`)
        // 发送消息
        await e.reply(msg);

        return true;
    }

    async bqelaina(e) {
        console.log("用户命令：", e.msg);
        let config = await cfg.getConfig('air', 'config')
        let Ark = config.Ark
        let msgurl = config.MsgUrl
        let url = `https://vst.qqmsg.cn/api/ebq`;
        let res = await fetch(url).catch((err) => logger.error(err));

        // 提取图片地址
        let imageUrl = res.url;
        let msg, tips, btn
        if (Ark) {
            msg = [segment.at(e.user_id), segment.image(imageUrl)]
            btn = [tool.button([
                tool.rows({ text: '再来一张', data: '#表情伊蕾娜', enter: true }),
                tool.rows({ text: '如未发送图片，点击查看', data: `${msgurl}${imageUrl}`, type: 0 })
            ])]
            await this.reply(btn)
            await this.reply(msg)
            return true

        }
        msg = [segment.at(e.user_id), segment.image(imageUrl)];

        e.reply(`\n如未发送图片，点击链接查看：${msgurl}${imageUrl}`)

        // 发送消息
        e.reply(msg);

        return true;
    }
}
