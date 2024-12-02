import fetch from 'node-fetch'
import cfg from '../lib/xxCfg.js'
import { tool, dirPath } from '../lib/tool.js'


export class example extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: '智能体',
			/** 功能描述 */
			dsc: 'znt-elaina',
			event: 'message',
			priority: 2,
			rule: [{
				reg: '^(/|#)(CE|ce)(.*)$',
				fnc: 'help'
			}
			]
		})
	}


	async help(e) {
		let config = await cfg.getConfig('air', 'config')
		let Ark = config.Ark
		let m = await main(this.e.msg.replace('(/|#)(CE|ce)', ''));
		if (Ark) {
			let msg = tool.textark('[伊蕾娜]', [tool.textobj(m)]);
			console.log(msg);
			await this.reply(msg);
			return true;
		}
		await this.reply(m)
	}
}


async function main(content) {
	let config = await cfg.getConfig('air', 'config')
	let chat = config.chat;
	let userid = 'Elaina';
	let appid = chat.appid;
	let token = chat.token;
	try {
		const response = await fetch('https://yuanqi.tencent.com/openapi/v1/agent/chat/completions', {
			method: 'POST',
			headers: {
				'X-Source': 'openapi',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({
				assistant_id: appid,
				user_id: userid,
				stream: false,
				messages: [
					{
						role: "user",
						content: [
							{
								type: "text",
								text: content
							}
						]
					}
				]
			})
		});
		const data = await response.json();
		console.log(data);
		//data = JSON.stringify(data);
		return data.choices[0].message.content;
	} catch (error) {
		console.log(error);
	}
}



