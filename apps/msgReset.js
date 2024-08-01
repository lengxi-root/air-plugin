import cfg from '../lib/xxCfg.js';
import fetch from 'node-fetch'
import { tool } from '../lib/tool.js';

export class msgReset extends plugin {
  constructor() {
    super({
      name: '全局消息转换',
      dsc: '将其他插件的消息处理后重新发送',
      event: 'message',
      priority: 2000,
    });
  }
  async accept() {
    let cdtime = 0//←请勿修改此配置
    let _cfg = await cfg.getConfig('air', 'config')
    let isopen = _cfg.msgReset
    if (!isopen) {
      return false
    } else {
      if (!_cfg.Ark_users) { logger.info('未配置Ark白名单'); return false }
      if (!_cfg.Ark_users.includes(this.e.self_id)) { return false }
      isopen = false;
      setTimeout(async () => {
        isopen = true;
      }, cdtime);
    }
    let old_reply = this.e.reply;
    this.e.reply = async function (msgs, quote, data) {
      if (!msgs) return false;
      if (!Array.isArray(msgs)) msgs = [msgs];
      msgs = await makeMsg(msgs)
      let result = await old_reply(msgs, quote, data);
      return result;
    }
  }
}

// 消息处理区
async function makeMsg(msg) {
  const messages = [], button = []
  let message = [], reply
  let msgurl = await cfg.getConfig('air', 'config')
  msgurl = msgurl.MsgUrl
  for (let i of Array.isArray(msg) ? msg : [msg]) {
    if (typeof i === "object") {
      i = { ...i }
    } else {
      i = { type: "text", text: Bot.String(i) }
    }
    // logger.info(i)
    switch (i.type) {
      case 'text':
        i.text = await textark(i.text)
        // logger.info(i.text)
        return [i.text]
      case 'image':
        if (Buffer.isBuffer(i.file)) i.file = await upimg(i.file, i)
        return [tool.imgark('[图片]', '', '', `${msgurl}${i.file}`)]
    }
  }
  return msg
}

async function textark(text) {
  let msgs = [];
  let splitText = text.replace(/&amp;/g, "").split('\n');
  let msgurl = await cfg.getConfig('air', 'config')
  msgurl = msgurl.MsgUrl
  for (let i = 0; i < splitText.length; i++) {
    msgs.push(tool.textobj(splitText[i].replace(/\\n/g, "\n").replace(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g, "")))
    let link = splitText[i].match(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g);
    if (link) {
      for (let j = 0; j < link.length; j++) {
        msgs.push(tool.textobj("查看链接", msgurl + link[j]))
      }
    }
  }
  return tool.textark('[AIR-Plugin]', msgs);
}
async function upimg(data) {
  let formdata = new FormData();
  formdata.append("file", new Blob([data]), {
    filename: Date.now(),//上传的文件名
    contentType: 'image/png',//文件类型标识
  });
  //改用花瓣图床了
  let res = await fetch('https://api.huaban.com/upload', {
    method: 'POST',
    body: formdata,
    headers: {
      Cookie: "user_device_id=e3dd10685265414f93d3f04c15e74685; user_device_id_timestamp=1703324451174; Hm_lvt_d4a0e7c3cd16eb58a65472f40e7ee543=1703324453; Hm_up_d4a0e7c3cd16eb58a65472f40e7ee543=%7B%22version%22%3A%7B%22value%22%3A%222.0.0%22%2C%22scope%22%3A1%7D%2C%22has_plugin%22%3A%7B%22value%22%3A%220%22%2C%22scope%22%3A1%7D%7D; acw_tc=0a5cc92217033244502815684e63a715799ce171d75d2e2ddc555219656e78; sid=s%3AHdhYR_G6ofOS2LVR7ykAuIsKC6_iO5RM.O2CDlmHn1uxS1%2F55NV9wT85TqH83c6OKsZ2P1xtWzlw; Hm_lpvt_d4a0e7c3cd16eb58a65472f40e7ee543=1703324453; uid=38424159; gd_id=2026592737661326360"
    }
  }
  )
  res = await res.json()
  const url = `https://gd-hbimg.huaban.com/${res.key}_fw1200`
  console.log(url)
  return url
}
