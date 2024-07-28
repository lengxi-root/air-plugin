import fetch from 'node-fetch';//网页访问用的
import cheerio from 'cheerio';
import moment from 'moment';
import { tool } from '../lib/tool.js';
import cfg from '../lib/xxCfg.js';

export class Mikan extends plugin {//插件的一个函数组，可以创建多个，以对不同消息类型进行处理，此为消息处理函数
  constructor() {
    super({
      /** 功能名称 */
      name: 'TS-Mikan',
      /** 功能介绍 */
      dsc: '蜜柑番剧推送',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',//消息匹配类型，“massage”处理消息的意思，详情看上面那个网站
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^(#|/)*(来点新番|蜜柑推送)$',//用正则表达式
          /** 执行方法 */
          fnc: 'test'//可以中文或英文
        }
      ]
    })
  }
  async test(e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    /** 最后回复消息 */
    let RSS = await getRss()
    logger.info(RSS)
    await e.reply(RSS)
  }

};

async function getRss() {
  try {
    let _cfg = await cfg.getConfig('air', 'config')
    let response
    if (_cfg.Mikan.withProxy) {
      response = await fetchWithProxy(`${_cfg.Mikan.url}/RSS/MyBangumi?token=${_cfg.Mikan.token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        proxies: _cfg.Mikan.Proxy, // 使用 Mikan 中的代理服务器信息
        timeout: 10000,
      })
    } else {
      response = await fetch(`${_cfg.Mikan.url}/RSS/MyBangumi?token=${_cfg.Mikan.token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    }
    const xml = await response.text();

    let $ = cheerio.load(xml, { xmlMode: true });

    let items = '最近5条新番如下：\n';

    $('item').slice(0, 5).each((i, item) => {
      const title = $(item).find('title').text();
      const link = $(item).find('link').text();
      const description = $(item).find('description').text();
      items += `Description: ${description}\nLink：${link}-----------------------------------\n`;
    });
    return items;
  } catch (error) {
    logger.wran(`[getRss] Error: ${error}`);
    return [];
  }
}
