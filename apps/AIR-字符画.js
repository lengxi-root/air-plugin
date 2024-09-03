import Image from 'ascii-art-image';
import { pipeline } from 'stream'
import { promisify } from 'util'
import fetch from 'node-fetch'
import fs from 'node:fs'
import path from 'node:path'
import { pluginPath } from '../lib/dir.js'
import { AnsiUp } from "ansi_up";
import puppeteer from "../../../lib/puppeteer/puppeteer.js";

const tempPath = path.join(process.cwd(), "./temp/Air/zfh.png");
const htmlPath = path.join(pluginPath, "./resources/zfh/AIR-字符画.html");
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
    main(e)

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
    main(e)

    this.finish('_zfh')
  }


}
async function downFile(fileUrl, savePath, param = {}) {
  try {
    mkdirs(path.dirname(savePath))
    logger.debug(`[下载文件] ${fileUrl}`)
    const response = await fetch(fileUrl, param)
    const streamPipeline = promisify(pipeline)
    await streamPipeline(response.body, fs.createWriteStream(savePath))
    return true
  } catch (err) {
    logger.error(`下载文件错误：${err}`)
    return false
  }
}

function mkdirs(dirname) {
  if (fs.existsSync(dirname)) return true
  if (mkdirs(path.dirname(dirname))) {
    fs.mkdirSync(dirname)
    return true
  }
}
async function a2h(text) {
  let ap = new AnsiUp();
  return await ap.ansi_to_html(text);
}
async function main(e) {
  try {
    await downFile(e.img[0], tempPath);
    let image = new Image({
      filepath: tempPath,
      alphabet: 'variant1',
    });
    await image.write(async function (err, data) {
      logger.info("\n" + data);
      data = await a2h(data)
      let jsondata = await fs.readFileSync(htmlPath, "utf8");
      jsondata = jsondata.replace("{{ content }}", data)
      fs.writeFileSync(path.join(pluginPath, "./resources/zfh/字符画.html"), jsondata);
      let ds = {
        tplFile: path.join(pluginPath, "./resources/zfh/字符画.html"),
      }
      let img = await puppeteer.screenshot("字符画", ds);
      e.reply(img);
    })
  } catch (err) {
    await e.reply('操作失败：' + err)
    return
  }

}