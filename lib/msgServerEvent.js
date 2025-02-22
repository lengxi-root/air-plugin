import cfg from './xxCfg.js'

var g_mid = {}

export default async function event(data) {
  const message = data;

  let cfgs = await cfg.getConfig("air", "config");
  let robot = cfgs.msgServer?.robot
  const d = message.d;
  if (d == 1) {
    const peer = message.peer;
    const msgid = message.msgid;
    const group = message.group;
    let ds = {}
    if (group) {
        g_mid[group] = { sign: 1, peer, time: Date.now() }
        return { d: 2, peer, group }
    }
    await new Promise((resolve) => {
      for (var i in g_mid) {
        if (g_mid[i].sign == 0) {
          g_mid[i] = { sign: 1, peer, msgid, time: Date.now() }
          ds = { d: 2, peer, msgid, group: i }
          resolve()
        }
      }
    });
    return ds
  }
  if (d == 3) {
    return g_mid
  }
  if (d == 4) {
    g_mid = data.ds
    return g_mid
  }
  if (d == 8) {
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
    return true
  }
}

