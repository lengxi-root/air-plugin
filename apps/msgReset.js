import cfg from '../lib/xxCfg.js';
import fetch from 'node-fetch'
import { tool } from '../lib/tool.js';
import event from '../lib/msgServerEvent.js';
import Button from '../lib/button.js';
import toimg from '../lib/toimg.js';
import imageSize from 'image-size';
import axios from 'axios';
import crypto from 'node:crypto';

let _cmdmsg = await cfg.getConfig('air', 'config')
var isresends = true
var inited = false

export default class msgReset extends plugin {
  constructor() {
    super({
      name: '全局消息转换',
      dsc: '将其他插件的消息处理后重新发送',
      event: 'message',
      priority: 2000,
      rule: [{
        reg: _cmdmsg?.msgServer?.sendcmd || 'msgServer',
        fnc: 'em'
      }, {
        reg: 'TS_cbind_(.*)',
        fnc: 'cbind'
      }]
    });
  }
  async accept(e) {
    let _cfg = await cfg.getConfig('air', 'config')
    let ub = _cfg.msgServer?.userbot;//代发数据账号
    let rb = _cfg.msgServer?.robot;//代发机器账号
    let mg = _cfg.msgServer?.group;//代发群列表
    let btnbot = _cfg.button?.btn_users[0];//发按钮的bot
    let self_id = this.e.self_id;
    let group_id = this.e.group?.group_id;
    //是否QQBot适配器
    let isQQbot = this.e.bot.version.name == 'QQBot'
    //全局ark开关
    let isopen = isQQbot && (_cfg.Ark_users?.includes(String(self_id))) && _cfg.msgReset;
    //代发开关
    let msgServer = !isQQbot && (mg?.includes(String(group_id))) && (ub == this.e.self_id) && (this.e.isGroup == true) && _cfg.msgServer?.open;
    //是否使用原生markdown
    let mds = isQQbot && _cfg.markdown?.mds
    //是否使用markdown
    let markdown = isQQbot && (_cfg.markdown?.text_open || _cfg.markdown?.img_open || _cfg.markdown?.mix_open)
    //原始reply对象
    let old_reply = this.e.reply;
    //是否使用全局转图
    let istoimg = _cfg.toimg?.open && (Bot.md2img || toimg)
    //是否使用按钮
    let isbtn = _cfg.button?.open && (_cfg.button?.template != null || _cfg.button?.template != '')
    if (!istoimg && !isopen && !msgServer && !isbtn && !markdown && !mds) return false;
    if (msgServer) {
      if (inited != true && _cfg?.msgServer?.auto) {
        inited = await this.setcallback();
        setInterval(async () => {
          if (_cfg?.msgServer?.auto) {
            logger.mark("[AIR-Plugin]执行callback进程")
            let gs = _cfg?.msgServer?.group
            for (let i of gs) {
              await Bot[rb].callbacks(i, `TS_cbind_${i}`)
              await sleep(4000)
            }
          }
        }, 250000)
      }
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        let result;
        if (istoimg) {
          const md = (await makeMds(msgs, e)).md;
          msgs = [segment.image(await Bot.md2img(md))]
        }
        if (isopen) {
          msgs = await makeMsg(msgs);
        } else if (markdown) {
          msgs = await makeMd(msgs);
        }
        result = await send(group_id, msgs, quote, data);
        if (!result) {
          result = await old_reply(msgs, quote, data);
        }
        if (isbtn && isQQbot && self_id == btnbot) {
          await send(group_id, [segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data);
        }
        return result
      }
    } else if (isQQbot) {
      this.e.reply = async function (msgs, quote, data) {
        if (!msgs) return true;
        if (!Array.isArray(msgs)) msgs = [msgs];
        let result;
        if (istoimg) {
          const md = (await makeMds(msgs, e)).md;
          msgs = [segment.image(await Bot.md2img(md))]
        }
        if (isopen) {
          msgs = await makeMsg(msgs);
        } else if (markdown) {
          msgs = await makeMd(msgs);
        } else if (mds) {
          msgs = (await makeMds(msgs, e)).msgs;
        }
        result = await old_reply(msgs, quote, data);
        if (isbtn && isQQbot) {
          await old_reply([segment.raw({ 'type': 'keyboard', 'id': _cfg.button?.template })], quote, data);
        }
        return result
      }
    } else {
      return false
    }
  }
  async cbind(e) {
    let ud = this.e.self_id;
    let cfgs = await cfg.getConfig("air", "config");
    let rb = cfgs?.msgServer?.robot;
    if (ud == rb) {
      let ds = {
        d: 1,
        peer: this.e.group.group_id,
        group: this.e.msg.replace(/TS_cbind_/, '')
      }
      await event(ds);
      await Bot[rb].setrawgroup(ds.peer, ds.group)
      if (!isresends) isresends = true
      return true
    }
    return true
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
      return true
    }
    return true
  }
  async setcallback(e) {
    inited = true;
    let cfgs = await cfg.getConfig("air", "config");
    if (cfgs?.msgServer?.auto) {
      logger.mark("[AIR-Plugin]初始化callback进程")
      let gs = cfgs?.msgServer?.group
      for (let i of gs) {
        let ds = await event({ d: 3 })
        ds[i] = {
          sign: 0
        }
        await event({ d: 4, ds })
        await Bot[cfgs?.msgServer?.robot].callbacks(i, `TS_cbind_${i}`)
        await sleep(3000)
      }
    }
    return inited;
  }


};//插个飞雷神

// 消息处理区
async function makeMsg(msg) {
  let _cfg = await cfg.getConfig('air', 'config')
  let msgs = [];
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
        if (typeof _cfg.Ark_set?.Text != 'undefined') {
          _text = await _cfg.Ark_set.Text.replace(/\[时间\]/g, time)
                                          .replace(/\[一言\]/g, ht)
                                          .replace(/\[换行\]/g, '\n')
                                          .replace(/\[消息内容\]/g, i.text);
        }
        i.text = await textark(_text || i.text);
        msgs.push(i.text);
        break;
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
        msgs.push(tool.imgark(wx || '[AIR-Plugin]', bt || '', xbt || '', `${i.file}`));
        break;
      case 'raw':
        if (i.data && Array.isArray(i.data)) {
          const nestedMsgs = await makeMsg(i.data);
          msgs.push(...nestedMsgs);
        } else {
          msgs.push(i);
        }
        break;
      default:
        msgs.push(i);
    }
  }
  return msgs
}
async function makeMds(msg, e) {
  let _cfg = await cfg.getConfig('air', 'config')
  let _text = '';
  let msgs = [];
  for (let i of Array.isArray(msg) ? msg : [msg]) {
    if (typeof i === "object") {
      i = { ...i }
    } else {
      i = { type: "text", text: Bot.String(i) }
    }
    let now, time, ht
    switch (i.type) {
      case 'text':
        now = new Date()
        time = now.toLocaleString()
        ht = await (await fetch("https://v1.hitokoto.cn/?encode=text&min_length=8&max_length=20")).text();
        if (typeof _cfg.markdown?.Text != 'undefined') {
          i.text = await _cfg.markdown.Text.replace(/\[时间\]/g, time)
                                            .replace(/\[一言\]/g, ht)
                                            .replace(/\[换行\]/g, '\n')
                                            .replace(/\[消息内容\]/g, i.text);
        }
        _text += i.text
        break
      case 'image':
        i.file = await Bot.Buffer(i.file);
        let { width, height } = await getImageSize(i.file)
        i.file = await upimg(i.file);
        i.file = `(${_cfg.MsgUrl}${i.file})`
        let px = `[[AIR-Plugin] #${width}px #${height}px]`
        _text += `!${px}${i.file}`
        break
      case 'raw':
        if (i.data && Array.isArray(i.data)) {
          const nestedMsgs = await makeMds(i.data, e);
          msgs.push(...nestedMsgs.msgs);
          _text += nestedMsgs.md;
        } else {
          msgs.push(segment.markdown(_text));
          if (Button) {
            const buttons = await button(e);
            if (buttons) msgs.push(buttons);
          }
          return { msgs, md: _text };
        }
        break;
      default:
        msgs.push(segment.markdown(_text));
        if (Button) {
          const buttons = await button(e);
          if (buttons) msgs.push(buttons);
        }
        return { msgs, md: _text };
    }
  }
  msgs.push(segment.markdown(_text))
  if (Button) {
    const buttons = await button(e)
    if (buttons) msgs.push(buttons)
  }
  return { msgs, md: _text }
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
        if (i.data && Array.isArray(i.data)) {
          const nestedMsgs = await makeMd(i.data);
          msgs.push(...nestedMsgs);
        } else {
          msgs.push(i);
        }
        break;
      default:
        msgs.push(i);
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

// 功能区
async function button(e) {
  try {
    for (let p of Button) {
      for (let v of p.plugin.rule) {
        const regExp = new RegExp(v.reg)
        if (regExp.test(e.msg)) {
          p.e = e
          let button = await p[v.fnc](e)
          const message = []
          if (button) {
            if (!Array.isArray(button)) button = [button]
            const rows = []
            button.forEach(item => {
              rows.push({
                buttons: item.buttons
              })
            })
            message.push({
              type: 'keyboard',
              content: { rows }
            })
            return segment.raw(...message)
          }
          return false
        }
      }
    }
  } catch (error) {
    logger.error('air-plugin', error)
    return false
  }
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

async function send(group, msg, quote, data) {
  let _cfg = await cfg.getConfig('air', 'config')
  let setting = await event({ d: 3 })
  let rb = _cfg?.msgServer?.robot;
  let cfgs = setting[group];
  let msgid = cfgs?.msgid
  let msgs = [];
  for (let i of Array.isArray(msg) ? msg : [msg]) {
    if (typeof i === "object") {
      i = { ...i }
    } else {
      i = { type: "text", text: Bot.String(i) }
    }
    switch (i.type) {
      case 'reply':
        break
      case 'at':
        if (i?.qq) msgs.push({ type: "text", text: `@${Bot.String(i.qq)} ` })
        break
      default:
        msgs.push(i)
    }
  }

  if (_cfg?.msgServer?.auto) {
    let ds = {
      d: 8,
      peer: cfgs?.peer,
      content: msgs,
      quote, data
    }
    if (!cfgs?.hasOwnProperty("peer")) {
        let ds = await event({ d: 3 })
        ds[group] = { sign: 0 }
        await event({ d: 4, ds })
        await Bot[rb].callbacks(group, `TS_cbind_${group}`)
        await sleep(500)
    }
    return await event(ds);
  } else if ((Date.now() - cfgs?.time > 250000) || (cfgs?.sign == 0) || (!cfgs?.hasOwnProperty("peer"))) {
    return await getmsgid(group, msgs, quote, data)
  }
  let ds = {
    d: 8,
    peer: cfgs?.peer,
    content: [{ type: 'reply', id: msgid }, ...msgs],
    quote, data
  }
  return await event(ds)
}

async function getmsgid(group, msgs, quote, data) {
  let _cfg = await cfg.getConfig('air', 'config')
  let ub = _cfg.msgServer?.userbot
  let robot = _cfg.msgServer?.robot
  isresends = false
  logger.mark("[AIR-Plugin]MsgID失效，尝试重新获取")
  let ds = await event({ d: 3 })
  ds[group] = {
    sign: 0
  }
  await event({ d: 4, ds })
  let groupobj = Bot[ub].pickGroup(group)
  let mid = (await groupobj.sendMsg([segment.at(robot), _cfg?.msgServer?.sendcmd || ' msgServer'])).message_id
  await groupobj.recallMsg(mid)
  let k = 0
  let result = true
  await sleep(500);
  await new Promise(async (resolve, reject) => {
    while (k < 10) {
      k++
      // logger.mark("[AIR-Plugin]getMsgID等待响应-" + String(k) + "|" + String(isresends))
      if (isresends == true) {
        resolve()
        break
      }
      await sleep(520)
    }
    reject()
  }).then(async () => {
    await send(group, msgs, quote, data)
  }).catch(() => {
    result = false
    logger.mark("[AIR-Plugin]MsgID失败")
  }).finally(() => k = 0);
  return result
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
  logger.mark(`[AIR-Plugin]频道图床URL： ${url}`);
  return url
}

async function img_hb(data) {
  let formdata = new FormData();
  let _cfg = await cfg.getConfig('air', 'config')
  formdata.append("file", 新建 Blob([data], { 请键入: 'image/png' }), {
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
  logger.mark(`[AIR-Plugin]花瓣图床URL： ${url}`);
  return url
}

// 小工具区
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
