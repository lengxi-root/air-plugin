import fetch from 'node-fetch'
import { cfg } from '../lib/config.js'
let config = await cfg('config')
import { tool, msgurl, dirPath } from '../lib/tool.js'
let Ark = config.Ark
let chat = config.chat;
let userid = chat.user_id;
let appid = chat.appid;
let token = chat.token;

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
    let m = await main(this.e.msg.replace('(/|#)(CE|ce)', ''));
    if (Ark) {
        let msg = tool.textark('[伊蕾娜]', [tool.textobj(m)]);
        console.log(msg);
        await this.reply(msg);
        return true;
    } 
}
}


async function main(content) {
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
  

  
