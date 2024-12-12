import cfg from '../lib/xxCfg.js';
import fetch from 'node-fetch'
import { tool } from '../lib/tool.js';
import event from '../lib/msgServerEvent.js';
import imageSize from 'image-size';
import axios from 'axios';
import crypto from 'node:crypto';

let _cmdmsg = await cfg.getConfig('air', 'config')

export class msgReset extends plugin {
  constructor() {
    super({
      name: '全局消息转换',
      dsc: '将其他插件的消息处理后重新发送',
      event: 'message',
      priority: 2000,
      rule: [{
        reg: _cmdmsg?.msgServer?.sendcmd || 'msgServer',
        fnc: 'em'
      }]
    });
  }
  async accept() {
    let _cfg = await cfg.getConfig('air', 'config')
    let isopen = _cfg.msgReset
    let ub = _cfg.msgServer?.userbot
    let mg = _cfg.msgServer?.group
    let msgServer = _cfg.msgServer?.open
    let markdown = (_cfg.markdown?.text_open || _cfg.markdown?.img_open || _cfg.markdown?.mix_open)
    let old_reply = this.e.reply;
    let isbtn = (_cfg.button?.open && (_cfg.button?.template != null || _cfg.button?.template != ''))
    msgServer = (ub == this.e.self_id) && msgServer && (this.e.isGroup == true)
    let self_id = this.e.self_id;
    let group_id = this.e.group?.group_id;
    if (!mg?.includes(String(group_id))) { msgServer = false }
    if (!_cfg.Ark_users?.includes(String(self_id))) { isopen = false }
    if (isbtn && isopen == false && markdown == false) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        let result
        if (msgServer) {
          result = await send(group_id, msgs, quote, data)
        } else {
          result = await old_reply(msgs, quote, data);
        }
        if (_cfg.button?.btn_users.includes(String(self_id))) { return result }
        await old_reply([segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data)
        return result;
      }
    } else if (isopen) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        msgs = await makeMsg(msgs)
        let result
        if (msgServer) {
          result = await send(group_id, msgs, quote, data)
        } else {
          result = await old_reply(msgs, quote, data);
        }
        if (_cfg.button?.btn_users == null) { logger.info('未配置按钮白名单'); return result }
        if (_cfg.button?.btn_users.includes(self_id)) { return result }
        if (isbtn) await old_reply([segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data)
        return result;
      }
    } else if (markdown) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        msgs = await makeMd(msgs)
        if (_cfg.button?.btn_users.includes(String(self_id))) { return old_reply(msgs, quote, data) }
        let result
        if (msgServer) {
          result = await send(group_id, msgs, quote, data)
        } else {
          result = await old_reply(msgs, quote, data);
        }
        return result
      }
    } else if (msgServer) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        let result = await send(group_id, msgs, quote, data)
        return result
      }
    } else {
      return true
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
      let res = await event(ds)
      if (res.d == 2 && !isresends) isresends = true
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
        i.file = await Bot.Buffer(i.file);
        i.file = await upimg(i.file)
        return [tool.imgark(wx || '[AIR-Plugin]', bt || '', xbt || '', `${i.file}`)]
    }
  }
  return msg
}
async function makeMd(msg) {
  let _cfg = await cfg.getConfig('air', 'config')
  let mix_open = (_cfg.markdown?.mix_open && typeof _cfg.markdown?.mix_id != 'undefined') || false
  let isbtn = (_cfg.button?.open && (_cfg.button?.template != null || _cfg.button?.template != ''))
  let msgs = []
  let params = []
  let btn = []
  for (let i of Array.isArray(msg) ? msg : [msg]) {
    if (typeof i === "object") {
      i = { ...i }
    } else {
      i = { type: "text", text: Bot.String(i) }
    }

    let md = []
    switch (i.type) {
      case 'text':
        if (!mix_open) {
          params.push({
            "key": _cfg.markdown?.text_a,
            "values": [i.text.replace(/\n/g, '\r')]
          })
          md.push(segment.markdown({ custom_template_id: _cfg.markdown?.text_id, params }))
          if (isbtn) md.push(segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template }))
          return md
        }
        params.push({
          "key": _cfg.markdown?.mix_text,
          "values": [i.text.replace(/\n/g, '\r')]
        })
        break
      case 'image':
        i.file = await Bot.Buffer(i.file);
        let { width, height } = await getImageSize(i.file)
        i.file = await upimg(i.file);
        i.file = `${_cfg.MsgUrl}${i.file}`
        let px = `[AIR-Plugin] #${width}px #${height}px`
        if (!mix_open) {
          params.push({
            "key": _cfg.markdown?.img_px,
            "values": [px]
          })
          params.push({
            "key": _cfg.markdown?.img_url,
            "values": [i.file]
          })
          md.push(segment.markdown({ custom_template_id: _cfg.markdown?.text_id, params }))
          if (isbtn) md.push(segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template }))
          return md
        }
        params.push({
          "key": _cfg.markdown?.mix_px,
          "values": [px]
        })
        params.push({
          "key": _cfg.markdown?.mix_url,
          "values": [i.file]
        })
        break
      case 'keyboard':
        if (i.id) {
          btn.push(segment.raw({ 'type': 'keyboard', 'id': i.id }))
        } else {
          btn.push(segment.raw({ 'type': 'keyboard', ...i.data }))
        }
        break
      case 'button':
        if (i.id) {
          btn.push(segment.raw({ 'type': 'keyboard', 'id': i.id }))
        } else {
          btn.push(segment.raw({ 'type': 'keyboard', ...i.data }))
        }
        break
      case 'raw':
        switch (i.data.type) {
          case 'keyboard':
            if (i.data.id) {
              btn.push(segment.raw({ 'type': 'keyboard', 'id': i.data.id }))
            } else {
              btn.push(segment.raw({ 'type': 'keyboard', ...i.data.data }))
            }
            break
          case 'button':
            if (i.data.id) {
              btn.push(segment.raw({ 'type': 'keyboard', 'id': i.data.id }))
            } else {
              btn.push(segment.raw({ 'type': 'keyboard', ...i.data.data }))
            }
            break
        }
        break
    }
  }
  msgs.push(segment.markdown({ custom_template_id: _cfg.markdown?.mix_id, params }))
  if (btn.length == 0 && isbtn == true) {
    msgs.push(segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template }))
  } else {
    msgs.push(...btn)
  }
  if (msgs.length == 0) msgs = msg
  return msgs
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
async function send(group, msgs, quote, data) {
  let setting = await event({ d: 3 })
  let cfgs = setting[group];
  let msgid = cfgs?.msgid
  if ((Date.now() - cfgs?.time > 250000) || (cfgs?.sign == 0) || (!cfgs?.hasOwnProperty("peer"))) {
    await getmsgid(group, msgs, quote, data)
    return true
  }
  let ds = {
    d: 8,
    peer: cfgs?.peer,
    content: [{ type: 'reply', id: msgid }, ...msgs],
    quote, data
  }
  await event(ds)
  return true
}
async function getmsgid(group, msgs, quote, data) {
  let _cfg = await cfg.getConfig('air', 'config')
  let ub = _cfg.msgServer?.userbot
  let robot = _cfg.msgServer?.robot
  isresends = false
  logger.info("[AIR-Plugin]MsgID失效，尝试重新获取")
  let ds = await event({ d: 3 })
  ds[group] = {
    sign: 0
  }
  await event({ d: 4, ds })
  let groupobj = Bot[ub].pickGroup(group)
  let mid = (await groupobj.sendMsg([segment.at(robot), _cfg?.msgServer?.sendcmd || ' msgServer'])).message_id
  await groupobj.recallMsg(mid)
  let k = 0
  await new Promise(async (resolve) => {
    while (k < 10) {
      k++
      logger.info("[AIR-Plugin]getMsgID等待响应-" + String(k) + "|" + String(isresends))
      if (isresends == true) {
        resolve()
        return await send(group, msgs, quote, data)
      }
      await sleep(520)
    }
    resolve()
  });
  if (isresends == false) {
    logger.info("[AIR-Plugin]MsgID失败")
  }
  k = 0
  return true
}
async function upimg(file) {
  let _cfg = await cfg.getConfig('air', 'config')
  if (typeof _cfg.imgbot == 'string' && _cfg.imgbot != '' && typeof _cfg.imgchannelid == 'string' && _cfg.imgchannelid != '') {
    return await img_cn(file)
  } else {
    return await img_hb(file)
  }
}
async function img_cn(data) {
  let _cfg = await cfg.getConfig('air', 'config')
  let botQQ = Number(_cfg?.imgbot)
  let channelid = Number(_cfg?.imgchannelid)

  const bot = {
    token: Bot[botQQ].sdk.sessionManager.access_token,
    appId: Bot[botQQ].info.appid,
    secret: Bot[botQQ].info.secret,
    channelId: channelid
  };

  const payload = new FormData();
  payload.append('msg_id', '0');
  payload.append('file_image', new Blob([data], { type: 'image/png' }), 'image.jpg');

  await axios.post(`https://api.sgroup.qq.com/channels/${bot.channelId}/messages`, payload, {
    headers: {
      Authorization: 'QQBot ' + bot.token,
      'X-Union-Appid': bot.appId
    }
  });
  const md5 = crypto.createHash('md5').update(data).digest('hex').toUpperCase();
  const url = `https://gchat.qpic.cn/qmeetpic/0/0-0-${md5}/0`;
  logger.info(`[AIR-Plugin]频道图床URL： ${url}`);
  return url
}
async function img_hb(data) {
  let formdata = new FormData();
  let _cfg = await cfg.getConfig('air', 'config')
  formdata.append("file", new Blob([data], { type: 'image/png' }), {
    filename: Date.now(),//上传的文件名
    contentType: 'image/png',//文件类型标识
  });
  let res = await fetch('https://api.huaban.com/upload', {
    method: 'POST',
    body: formdata,
    headers: {
      Cookie: _cfg?.imgck?.trim()
    }
  })
  res = await res.json()
  const url = `https://gd-hbimg.huaban.com/${res.key}_fw1200`
  logger.info(`[AIR-Plugin]花瓣图床URL： ${url}`);
  return url
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function getImageSize(url) {
  if (Buffer.isBuffer(url)) {
    return imageSize(new Uint8Array(url));
  } else {
    let res = await fetch(url)
    res = await res.arrayBuffer()
    res = new Uint8Array(res)
    return imageSize(res);
  }
}