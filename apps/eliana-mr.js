import { segment } from "oicq";
import fs from 'fs';
import path from 'path'; 
import fetch from 'node-fetch'; // 确保已安装 node-fetch

const _path = process.cwd();

export class wallpaper extends plugin {
    constructor() {
        super({
            name: '今日伊蕾娜',
            dsc:'mrelaina',
            event:'message',
            priority: 500,
            rule: [
                {
                    reg: "^(#|/)今日伊蕾娜$",
                    fnc:'mrelaina'
                }
            ]
        });
    }

    async mrelaina(e) {
        console.log("用户命令：", e.msg);

        try {
            // 发送请求获取跳转后的图片链接
            const response = await fetch('https://vst.qqmsg.cn/api/emr', {
                redirect: 'follow' // 跟随重定向
            });
            if (!response.ok) {
                throw new Error(`HTTP 错误！状态: ${response.status}`);
            }
            const imageUrl = response.url; // 获取最终的图片链接

            const today = new Date();
            const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            const recordFilePath = path.join(_path, './plugins/elaina-plugin/config/dksj.ini');

            let existingRecord;
            try {
                existingRecord = JSON.parse(await fs.readFileSync(recordFilePath, 'utf-8'));
            } catch (err) {
                existingRecord = {};
            }

            if (existingRecord[e.user_id] && existingRecord[e.user_id].date === formattedToday) {
                const { randomNumber, imageUrl: savedImageUrl } = existingRecord[e.user_id];
                let msg = [segment.image(savedImageUrl)];
                e.reply(`\n你今日的 ELaina 值是：${randomNumber}\n如果图片未发送成功，请点击链接查看：https://vst.qqmsg.cn/url?url=${savedImageUrl}`);
                e.reply(msg);
                return true;
            }

            let randomNumber = Math.floor(Math.random() * 100) + 1; 

            existingRecord[e.user_id] = {
                date: formattedToday,
                randomNumber: randomNumber,
                imageUrl: imageUrl
            };

            await fs.writeFileSync(recordFilePath, JSON.stringify(existingRecord));

            let msg = [segment.image(imageUrl)];
            e.reply(`\n你今日的 ELaina 值是：${randomNumber}\n如果图片未发送成功，请点击链接查看：https://vst.qqmsg.cn/url?url=${imageUrl}`);
            e.reply(msg);

            return true; 
        } catch (error) {
            logger.error(`获取图片链接失败: ${error.message}`);
            e.reply('获取图片失败，请稍后再试');
            return;
        }
    }
}