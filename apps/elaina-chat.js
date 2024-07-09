import fetch from 'node-fetch'
const 用户id = "用户id";//看调用示例里面的user_id
const 智能体id = "智能体id"
const token = "token"
export class example extends plugin {
	constructor() {
		super({
			/** 功能名称 */
		name: 'elaina智能体',
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
		let m = await main(this.e.msg.replace('(/|#)(CE|ce)',''));
		console.log(m);
		this.reply("\n"+m, true)
		return true;
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
		  assistant_id: 智能体id,
		  user_id: 用户id,
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
  

  
