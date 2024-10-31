import axios from "axios"
import _ from "lodash"
const url = "http://datukuai.top:2233/memes/charpic"
export class zifuhua extends plugin {
  constructor() {
    super({
      name: '图片转字符画',
      dsc: '用图片生成字符画',
      event: 'message',
      priority: -1145,
      rule: [
        {
          reg: '^(#|/)*(字符画|zfh)$',
          fnc: 'zfh',
        },
      ]
    })
  }

  async zfh(e) {
    if (!this.e.img) {
      this.setContext('_zfh')
      this.e.reply('⚠ 请发送图片')
      return
    }
    e = this.e
    main2(e)

  }

  async _zfh(e) {
    let img = this.e.img
    if (/取消/.test(this.e.msg)) {
      this.finish('_zfh')
      await this.reply('✅ 已取消')
      return
    }
    if (!img) {
      this.setContext('_zfh')
      await this.reply('❎ 请发送图片或取消')
      return
    }
    e = this.e
    main2(e)

    this.finish('_zfh')
  }


}
async function main2(e) {
  const id = e.at || e.user_id
  const pick = await e.group?.pickMember?.(id) || await e.bot?.pickFriend?.(id)
  const info = await pick?.getInfo?.() || pick?.info || pick
  const name = info?.card || info?.nickname
  const formData = new FormData()
  const imgRes = await axios.get(e.img[0], { responseType: 'arraybuffer' })
  const buffer = Buffer.from(imgRes.data)
  formData.append("images", new Blob([buffer]))

  let args
  args = handleArgs([{ text: name, gender: "unknown" }])
  formData.set("args", args)
  const res = await axios.post(`${url}/`, formData, { responseType: 'arraybuffer' })
  const resultBuffer = Buffer.from(res.data)
  return e.reply(segment.image(resultBuffer))
}
function handleArgs(userInfos) {
  let argsObj = {}
  argsObj.user_infos = userInfos.map(u => {
    return {
      name: _.trim(u.text, "@"),
      gender: u.gender
    }
  })
  return JSON.stringify(argsObj)
}
