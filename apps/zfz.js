import { segment } from "oicq";
const _path = process.cwd();
import fs from 'fs';
import axios from 'axios';

export class CharacterCountPlugin extends plugin {
    constructor() {
        super({
            name: '字符字',
            dsc: '字符符',
            event: 'message',
            priority: -100,
            rule: [
                {
                    reg: "^(#|/)?字符字(.*)$",
                    fnc: 'countCharactersAndGetSpecialChar'
                }
            ]
        });
    }

    async countCharactersAndGetSpecialChar(e) {
        console.log("用户输入：", e.msg);
        const inputContent = e.msg.replace(/^(#|\/)?字符字/, '').trim();
        if (inputContent === " " || inputContent === "" || inputContent === "-" || inputContent === "|") {
            await this.reply("你未输入字符内容，请在指令内输入字符。");
            return;
        }
        // 将输入内容拆分为单个字符
        const characters = inputContent.split('');
        const characterCount = characters.length;
        try {
            let specialCharContent = '';
            for (const char of characters) {
                const response = await axios.get(`http://life.chacuo.net/convertfont2char?data=${char}&type=font2char&arg=s%3D10_b%3D_f%3D${char}_t%3D6_d%3Dv`);
                specialCharContent += response.data.data + '\n';
            }
            // 检查并删除第 15 倍数行的内容
            const lines = specialCharContent.split('\n');
            const filteredLines = lines.filter((_, index) => (index + 1) % 15!== 0);
            const processedLines = filteredLines.map(line => line.slice(1, -1).slice(0, -1));
            const filteredContent = '\n' + processedLines.join('\n');
            await this.reply(filteredContent);
        } catch (error) {
            await this.reply('生成错误');
        }
    }
}