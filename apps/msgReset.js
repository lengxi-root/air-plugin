import cfg from '../lib/xxCfg.js';
import fetch from 'node-fetch'
import { tool } from '../lib/tool.js';
import event from '../lib/msgServerEvent.js'

export class msgReset extends plugin {
  constructor() {
    super({
      name: '全局消息转换',
      dsc: '将其他插件的消息处理后重新发送',
      event: 'message',
      priority: 2000,
      rule: [{
        reg: '^msgServer$',
        fnc: 'em'
      }, {
        reg: "愿此行，终抵群星",
        fnc: 'eem'
      },]
    });
  }
  async accept() {
    let _cfg = await cfg.getConfig('air', 'config')
    let isopen = _cfg.msgReset
    let ub = _cfg.msgServer?.userbot
    let mg = _cfg.msgServer?.group
    let msgServer = _cfg.msgServer?.open
    let old_reply = this.e.reply;
    let isbtn = (_cfg.button?.open && (_cfg.button?.template != null || _cfg.button?.template != ''))
    msgServer = (ub == this.e.self_id) && msgServer && (this.e.isGroup == true)
    let self_id = this.e.self_id;
    let group_id = this.e.group?.group_id;
    if (!mg?.includes(String(group_id))) { msgServer = false }
    if (!_cfg.Ark_users?.includes(String(self_id))) { isopen = false }
    if (isbtn && isopen == false) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return false;
        if (!Array.isArray(msgs)) msgs = [msgs];
        let result
        if (msgServer) {
          result = await send(group_id, msgs, quote, data)
        } else {
          result = await old_reply(msgs, quote, data);
        }
        if (!_cfg.button?.btn_users.includes(String(self_id))) { return result }
        await old_reply([segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data)
        return result;
      }
    } else if (isopen) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return false;
        if (!Array.isArray(msgs)) msgs = [msgs];
        msgs = await makeMsg(msgs)
        let result
        if (msgServer) {
          result = await send(group_id, msgs, quote, data)
        } else {
          result = await old_reply(msgs, quote, data);
        }
        if (_cfg.button?.btn_users == null) { logger.info('未配置按钮白名单'); return result }
        if (!_cfg.button?.btn_users.includes(self_id)) { return result }
        if (isbtn) await old_reply([segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data)
        return result;
      }
    } else if (msgServer) {
      result = await send(group_id, msgs, quote, data)
      return result
    } else {
      return false
    }

  }
  async eem(e) {
    let ud = this.e.user_id;
    let cfgs = await cfg.getConfig("air", "config");
    if ((ud == cfgs?.msgServer?.robot) && (isresends == false)) {
      isresends = true
    }
  }
  async em(e) {
    let ud = this.e.self_id;
    let cfgs = await cfg.getConfig("air", "config");
    if (ud == cfgs?.msgServer?.robot) {
      let ds = {
        d: 1,
        peer: this.e.group.group_id,
        msgid: this.e.message_id
      }
      await event(ds)
    }
  }


};//插个飞雷神

// 消息处理区
var isresends = true
async function makeMsg(msg) {
  let _cfg = await cfg.getConfig('air', 'config')
  for (let i of Array.isArray(msg) ? msg : [msg]) {
    if (typeof i === "object") {
      i = { ...i }
    } else {
      i = { type: "text", text: Bot.String(i) }
    }
    let now, time, ht, _text
    switch (i.type) {
      case 'text':
        now = new Date()
        time = now.toLocaleString()
        ht = await fetch("https://v1.hitokoto.cn/?encode=text&min_length=8&max_length=20");
        ht = await ht.text();
        if (typeof _cfg.Ark_set?.Text != 'undefined') _text = await _cfg.Ark_set.Text.replace(/\[时间\]/g, time).replace(/\[一言\]/g, ht).replace(/\[换行\]/g, '\n').replace(/\[消息内容\]/g, i.text)
        i.text = await textark(_text || i.text)
        // logger.info(i.text)
        return [i.text]
      case 'image':
        now = new Date()
        time = now.toLocaleString()
        ht = await fetch("https://v1.hitokoto.cn/?encode=text&min_length=8&max_length=20");
        ht = await ht.text();
        let wx, bt, xbt;
        if (typeof _cfg.Ark_set?.img_wx != 'undefined') wx = _cfg.Ark_set.img_wx || _cfg.Ark_set.Text_wx;
        if (typeof _cfg.Ark_set?.img_bt != 'undefined') bt = await _cfg.Ark_set.img_bt.replace(/\[时间\]/g, time).replace(/\[一言\]/g, ht);
        if (typeof _cfg.Ark_set?.img_xbt != 'undefined') xbt = await _cfg.Ark_set.img_xbt.replace(/\[时间\]/g, time).replace(/\[一言\]/g, ht);
        if (Buffer.isBuffer(i.file)) i.file = await upimg(i.file);
        return [tool.imgark(wx || '[AIR-Plugin]', bt || '', xbt || '', `${i.file}`)]
    }
  }
  return msg
}

async function textark(text) {
  let msgs = [];
  let splitText = text.replace(/&amp;/g, "").split('\n');
  let _cfg = await cfg.getConfig('air', 'config')
  let msgurl = _cfg.MsgUrl
  let wx = _cfg.Ark_set?.Text_wx || '[AIR-Plugin]'
  for (let i = 0; i < splitText.length; i++) {
    msgs.push(tool.textobj(splitText[i].replace(/\\n/g, "\n").replace(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g, "")))
    let link = splitText[i].match(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g);
    if (link) {
      for (let j = 0; j < link.length; j++) {
        msgs.push(tool.textobj("查看链接", msgurl + link[j]))
      }
    }
  }
  return tool.textark(wx, msgs);
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
async function send(group, msgs, quote, data) {
  let setting = await cfg.getConfig("air", "msgServer")
  let cfgs = setting[group];
  let msgid = cfgs?.msgid
  if ((Date.now() - cfgs?.time > 250000) || (cfgs?.sign == 0) || (!cfgs?.hasOwnProperty("peer"))) {
    await getmsgid(group, msgs, quote, data)
    return false
  }
  let ds = {
    d: 8,
    peer: cfgs?.peer,
    content: [{ type: 'reply', id: msgid }, ...msgs],
    quote, data
  }
  await event(ds)
  return false
}
async function getmsgid(group, msgs, quote, data) {
  let _cfg = await cfg.getConfig('air', 'config')
  let ub = _cfg.msgServer?.userbot
  let robot = _cfg.msgServer?.robot
  isresends = false
  logger.info("[AIR-Plugin]MsgID失效，尝试重新获取")
  let ds = await cfg.getConfig("air", "msgServer")
  ds[group] = {
    sign: 0
  }
  await cfg.saveSet("air", "msgServer", "config", ds);
  let groupobj = Bot[ub].pickGroup(group)
  let mid = (await groupobj.sendMsg([segment.at(robot), " msgServer"])).message_id
  await sleep(2024)
  await groupobj.recallMsg(mid)
  let k = 0
  while (k < 10) {
    k++
    logger.info("[AIR-Plugin]getMsgID等待响应-" + String(k) + "|" + String(isresends))
    await sleep(2024)
    if (isresends == true) {
      return await send(group, msgs, quote, data)
    }
  }
  if (isresends == false) {
    logger.info("[AIR-Plugin]MsgID失败")
  }
  k = 0
  return false
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}