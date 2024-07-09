import { segment } from "oicq";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // 确保已安装 node-fetch
import { tool, msgurl, dirPath } from '../lib/tool.js'
import { cfg } from '../lib/config.js'
let config = await cfg('config')
let Ark = config.Ark
const _path = process.cwd();

export class wallpaper extends plugin {
    constructor() {
        super({
            name: '今日伊蕾娜',
            dsc: 'mrelaina',
            event: 'message',
            priority: 500,
            rule: [
                {
                    reg: "^(#|/)今日伊蕾娜$",
                    fnc: 'mrelaina'
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

            const recordFilePath = path.join(_path, `${dirPath}/note/dksj.ini`);

            let existingRecord;
            try {
                existingRecord = JSON.parse(await fs.readFileSync(recordFilePath, 'utf-8'));
            } catch (err) {
                existingRecord = {};
            }

            if (existingRecord[e.user_id] && existingRecord[e.user_id].date === formattedToday) {
                const { randomNumber, imageUrl: savedImageUrl } = existingRecord[e.user_id];
                if (Ark) {
                    let msg = [tool.imgark('[伊蕾娜]', `你今日的 ELaina 值是：${randomNumber}`, '', `${msgurl}${imageUrl}`)]
                    let btn = [tool.button([
                        tool.rows({ text: '今日打卡', data: '#今日伊蕾娜', enter: true }),
                        tool.rows({ text: '点击跳转', data: `${msgurl}${imageUrl}`, type: 0 })
                    ])]
                    await this.reply(msg)
                    await this.reply(btn)
                    return true

                }
                let msg = [segment.at(e.user_id), `\n你今日的 ELaina 值是：${randomNumber}\n`, segment.image(savedImageUrl)];
                e.reply(msg);
                e.reply(`如果图片未发送成功，请点击链接查看：${msgurl}${savedImageUrl}`);
                return true;
            }

            let randomNumber = Math.floor(Math.random() * 100) + 1;

            existingRecord[e.user_id] = {
                date: formattedToday,
                randomNumber: randomNumber,
                imageUrl: imageUrl
            };

            fs.writeFileSync(recordFilePath, JSON.stringify(existingRecord));
            if (Ark) {
                let msg = [tool.imgark('[伊蕾娜]', `你今日的 ELaina 值是：${randomNumber}`, '', `${msgurl}${imageUrl}`)]
                let btn = [tool.button([
                    tool.rows({ text: '今日打卡', data: '#今日伊蕾娜', enter: true }),
                    tool.rows({ text: '点击跳转', data: `${msgurl}${imageUrl}`, type: 0 })
                ])]
                await this.reply(msg)
                await this.reply(btn)
                return true

            }
            let msg = [segment.at(e.user_id), `\n你今日的 ELaina 值是：${randomNumber}\n`, segment.image(savedImageUrl)];
            e.reply(msg);
            e.reply(`如果图片未发送成功，请点击链接查看：${msgurl}${savedImageUrl}`);
            return true;
        } catch (error) {
            logger.error(`获取图片链接失败: ${error.message}`);
            e.reply('获取图片失败，请稍后再试');
            return;
        }
    }
}
