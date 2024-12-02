import cfg from './xxCfg.js'
export default async function event(data) {
  const message = data;

  let cfgs = await cfg.getConfig("air", "config");
  let robot = cfgs.msgServer?.robot
  const d = message.d;
  if (d == 1) {
    const peer = message.peer;
    const msgid = message.msgid;
    let file = await cfg.getConfig("air", "msgServer");
    for (var i in file) {
      if (file[i].sign == 0) {
        file[i] = { sign: 1, peer, msgid, time: Date.now() }
        await cfg.saveSet("air", "msgServer", "config", file)
        let ds = { d: 2, peer, msgid, group: i }
        await event(ds)
      }
    }
  }

  if (message.d == 2) {
    let msgid = message.msgid;
    let group = message.group;
    let peer = message.peer;
    let groupobj = Bot[robot].pickGroup(peer)
    let mid = (await groupobj.sendMsg([{ type: 'reply', id: msgid }, cfgs?.msgServer?.callcmd || 'Elaina'])).message_id
    await new Promise(resolve => setTimeout(resolve, 2024))
    groupobj.recallMsg(mid)
  }
  if (message.d == 8) {
    let msgid = message.msgid;
    let content = message.content;
    let peer = message.peer;
    let quote = message.quote;
    let groupobj = Bot[robot].pickGroup(peer)
    let datas = message.data;
    let mid = (await groupobj.sendMsg(content)).message_id
    if (datas?.recallMsg) {
      await new Promise(resolve => setTimeout(resolve, datas.recallMsg * 1000))
      groupobj.recallMsg(mid)
    }
  }
}

