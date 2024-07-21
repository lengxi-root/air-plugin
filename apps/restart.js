export class Restart extends plugin {
  constructor(e) {
    super({
      name: "进程管理",
      dsc: "#重启",
      event: "message",
      priority: 10,
      rule: [
      ]
    })
    if (e) this.e = e
  }
  key = "Yz:restart-air"

  init() {
    Bot.once("online", () => this.restartMsg())
  }

  async restartMsg() {
    let restart = await redis.get(this.key)
    if (!restart) return
    await redis.del(this.key)
    restart = JSON.parse(restart)
    const time = Bot.getTimeDiff(restart.time)
    const msg = [restart.isExit ? `开机成功，距离上次停止${time}` : `[AIR-Plugin]重启成功，用时${time}`]
    if (restart.msg_id)
      msg.unshift(segment.reply(restart.msg_id))

    if (restart.group_id)
      await Bot.sendGroupMsg(restart.bot_id, restart.group_id, msg)
    else if (restart.user_id)
      await Bot.sendFriendMsg(restart.bot_id, restart.user_id, msg)
    else
      await Bot.sendMasterMsg(msg)
  }

  async set(isExit) {
    await this.reply(`[AIR-Plugin]开始${isExit ? "停止" : "重启"}，本次运行时长${Bot.getTimeDiff()}`)
    return redis.set(this.key, JSON.stringify({
      isExit,
      group_id: this.e.group_id,
      user_id: this.e.user_id,
      bot_id: this.e.self_id,
      msg_id: this.e.message_id,
      time: Date.now(),
    }))
  }

  async restart() {
    await this.set()
    if (process.env.app_type === "pm2") {
      const ret = await Bot.exec("pnpm run restart")
      if (!ret.error) process.exit()
      await this.reply(`重启错误\n${ret.error}\n${ret.stdout}\n${ret.stderr}`)
      Bot.makeLog("error", ["重启错误", ret])
    } else process.exit()
  }


}