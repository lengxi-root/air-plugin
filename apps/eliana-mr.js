import { segment } from "oicq";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { tool, dirPath } from '../lib/tool.js'
import cfg from '../lib/xxCfg.js'
const _path = process.cwd();

export class wallpaper extends plugin {
    constructor() {
        super({
            name: '今日伊蕾娜',
            dsc: 'mre',
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
        let config = await cfg.getConfig('air', 'config')
        let Ark = config.Ark
        let msgurl = config.MsgUrl
        try {
            const today = new Date();
            const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            const mainPath = path.join(_path, `${dirPath}/main`);
            const dataPath = path.join(mainPath, 'data');

            // 检查并创建 data 文件夹，如果不存在
            if (!fs.existsSync(dataPath)) {
                fs.mkdirSync(dataPath, { recursive: true });
            }

            const recordFilePath = path.join(dataPath, 'dksj.ini');

            let existingRecord;
            try {
                existingRecord = JSON.parse(await fs.readFileSync(recordFilePath, 'utf-8'));
            } catch (err) {
                existingRecord = {};
            }

            // 如果该用户当天已经获取过，直接返回已有的数据
            if (existingRecord[e.user_id] && existingRecord[e.user_id].date === formattedToday) {
                const { randomNumber, imageUrl } = existingRecord[e.user_id];

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
                let msg = [segment.at(e.user_id), `\n 你今日的 ELaina 值是：${randomNumber}\n`, segment.image(imageUrl)];
                e.reply(msg);
                e.reply(`如果图片未发送成功，请点击链接查看：${msgurl}${imageUrl}`);
                return true;
            }

            // 如果当天未获取过，进行新的获取
            const response = await fetch('https://vst.qqmsg.cn/api/emr', {
                redirect: 'follow'
            });
            if (!response.ok) {
                throw new Error(`HTTP 错误！状态: ${response.status}`);
            }
            const imageUrl = response.url;

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
            let msg = [segment.at(e.user_id), `\n 你今日的 ELaina 值是：${randomNumber}\n`, segment.image(imageUrl)];
            e.reply(msg);
            e.reply(`如果图片未发送成功，请点击链接查看：${msgurl}${imageUrl}`);
            return true;
        } catch (error) {
            logger.error(`获取图片链接失败: ${error.message}`);
            e.reply('获取图片失败，请稍后再试');
            return;
        }
    }
}