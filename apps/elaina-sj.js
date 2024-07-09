import { segment } from "oicq";
import fetch from "node-fetch";

const _path = process.cwd();

export class wallpaper extends plugin {
    constructor() {
        super({
            name: 'api伊蕾娜',
            dsc:'api-elaina',
            event:'message',
            priority: 500,
            rule: [
                {
                    reg: "^#随机伊蕾娜$",
                    fnc:'sjelaina'
                },
                {
                    reg: "^#表情伊蕾娜$",
                    fnc: 'bqelaina'
                }
            ]
        })
    }

    async sjelaina(e) {
        console.log("用户命令：", e.msg);
        let url = `https://vst.qqmsg.cn/api/esj`;  
        let res = await fetch(url).catch((err) => logger.error(err));

        // 提取图片地址
        let imageUrl = res.url;  

        let msg = [segment.at(e.user_id), segment.image(imageUrl)]; 
       
        e.reply(`\n如果图片未发送成功，请点击链接查看：https://vst.qqmsg.cn/url?url=${imageUrl}`)

        // 发送消息
        e.reply(msg);

        return true; 
    }

    async bqelaina(e) {
        console.log("用户命令：", e.msg);
        let url = `https://vst.qqmsg.cn/api/ebq`;  
        let res = await fetch(url).catch((err) => logger.error(err));

        // 提取图片地址
        let imageUrl = res.url;  

        let msg = [segment.at(e.user_id), segment.image(imageUrl)]; 
       
        e.reply(`\n如果图片未发送成功，请点击链接查看：https://vst.qqmsg.cn/url?url=${imageUrl}`)

        // 发送消息
        e.reply(msg);

        return true; 
    }
}