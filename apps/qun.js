import plugin from '../../../lib/plugins/plugin.js';
import fetch from 'node-fetch';
import { segment } from 'oicq';
import fs from 'fs';

export class CombinedPlugin extends plugin {
    constructor() {
        super({
            name: '群数量列表',
            dsc: '提供群数量查询和群列表功能',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: "^(#|/)?群数量$",
                    fnc: 'getGroupCount',
                    permission: 'master'
                },
                {
                    reg: "^(#|/)群列表$",
                    fnc: 'getGroupList',
                    permission: 'master'
                }
            ]
        });
    }

    async test(e) {
        console.log('[用户命令]', e.msg);
        await e.reply("「群数量列表」运行中\n注意:群列表群多请谨慎使用", true);
    }

    async getGroupCount(e) {
        let count = 0;
        for (const [key, value] of Bot.gl) {
            count++;
        }
        this.e.reply(`目前加入的群组数量为：${count}`);
    }

    async getGroupList(e) {
        const list = [];
        for (const [key, value] of Bot.gl) {
            list.push({
                groupName: value.group_name,
                groupId: key
            });
        }
        this.e.reply(`${list.map(item => item.groupId).join(',')}`);
    }
}