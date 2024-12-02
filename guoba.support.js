import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cfg from './lib/xxCfg.js';
import fs from 'fs';
import yaml from 'yaml';
import lodash from 'lodash'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `air-plugin`,
      title: 'air插件(air-plugin)',
      author: ['@冷曦', '@Ts霆生'],
      authorLink: ['https://github.com/lengxi-root/', 'https://github.com/Ts-yf'],
      link: 'https://github.com/lengxi-root/air-plugin',
      isV4: true,
      isV3: true,
      isV2: false,
      description: `伊蕾娜Api与全局消息转换`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(__dirname, 'main/helps/icon.png')
    },
    configInfo: {
      schemas: [
        {
          component: 'Divider',
          label: '全局消息转换设置'
        },
        {
          field: 'MsgUrl',
          label: '消息url配置',
          bottomHelpMessage: '非必填，请看README.md设置教程和搭建服务',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '如：https://vst.qqmsg.cn/url?url=',
          }
        },
        {
          field: 'imgck',
          label: '花瓣图床配置',
          bottomHelpMessage: '使用全局转换功能必填，使用浏览器访问huaban.com自行获取cookie',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '请求标头的cookie值的全部内容',
          }
        },
        {
          component: 'Divider',
          label: 'TTS语音转换'
        },
        {
          field: 'tts_token',
          label: 'tts-token设置',
          bottomHelpMessage: '内置共用40w字token，用光如果还需要联系2218872014',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '输入32位token',
          }
        },
        {
          component: 'Divider',
          label: 'Ark卡片设置'
        },
        {
          field: 'Ark',
          label: 'Ark卡片模式',
          bottomHelpMessage: '仅官方Bot开启使用，其他请关闭',
          component: 'Switch'
        },
        {
          field: 'msgReset',
          label: '全局转Ark',
          bottomHelpMessage: '将其他插件的消息转换成Ark',
          component: 'Switch'
        },
        {
          field: 'Ark_users',
          label: 'Ark白名单',
          bottomHelpMessage: '填写Bot账号QQ号',
          component: 'GTags',
          componentProps: {
            allowAdd: true,
            allowDel: true,
          },
        },
        {
          field: 'Ark_set.Text_wx',
          label: '文本卡片外显',
          bottomHelpMessage: '非必填，在消息列表查看的文字',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '',
          }
        },
        {
          field: 'Ark_set.Text',
          label: '文卡消息格式',
          bottomHelpMessage: '非必填，文本卡片内容格式，自由搭配，可用变量：[消息内容]，[换行]，[时间]，[一言]',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '例子：BotName[换行][时间][换行][消息内容][换行][一言]',
          }
        },
        {
          field: 'Ark_set.img_wx',
          label: '大图卡片外显',
          bottomHelpMessage: '非必填，在消息列表查看的文字',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '留空则使用文本卡片标题',
          }
        },
        {
          field: 'Ark_set.img_bt',
          label: '大图卡片标题',
          bottomHelpMessage: '非必填，大图卡片大标题，可用变量：[时间]，[一言]',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '留空则不使用标题，不宜过长',
          }
        },
        {
          field: 'Ark_set.img_xbt',
          label: '大图卡片小标题',
          bottomHelpMessage: '非必填，大图卡片小标题，可用变量：[时间]，[一言]',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '留空则不使用小标题，不宜过长',
          }
        },
        {
          component: 'Divider',
          label: 'Markdown类设置'
        },
        {
          field: 'button.open',
          label: '开启按钮',
          bottomHelpMessage: '在每一条消息最后发送按钮',
          component: 'Switch'
        },
        {
          field: 'button.btn_users',
          label: 'Markdown白名单',
          bottomHelpMessage: '填写Bot账号QQ号，只能填一个（懒得弄对应了）',
          component: 'GTags',
          componentProps: {
            allowAdd: true,
            allowDel: true,
          },
        },
        {
          field: 'button.template',
          label: '按钮模板id',
          bottomHelpMessage: '按钮的模板id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '只能填一个',
          }
        },
        {
          field: 'markdown.text_open',
          label: '开启纯文模板',
          bottomHelpMessage: '纯文转换模板md',
          component: 'Switch'
        },
        {
          field: 'markdown.text_id',
          label: '纯文模板id',
          bottomHelpMessage: '纯文字使用的md模板id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '114_514',
          }
        },
        {
          field: 'markdown.text_a',
          label: '纯文模板参数',
          bottomHelpMessage: '纯文字使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'a',
          }
        },
        {
          field: 'markdown.img_open',
          label: '开启图片模板',
          bottomHelpMessage: '图片转换模板md',
          component: 'Switch'
        },
        {
          field: 'markdown.img_id',
          label: '图片模板id',
          bottomHelpMessage: '纯图片使用的md模板id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '114_514',
          }
        },
        {
          field: 'markdown.img_px',
          label: '图片模板大小参数',
          bottomHelpMessage: '纯图片使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'imgsize模板参数格式：![{{.imgsize}}]({{.imgurl}})',
          }
        },
        {
          field: 'markdown.img_url',
          label: '图片模板链接参数',
          bottomHelpMessage: '纯图片使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'imgurl模板参数格式：![{{.imgsize}}]({{.imgurl}})',
          }
        },
        {
          field: 'markdown.mix_open',
          label: '开启图文模板',
          bottomHelpMessage: '图文转换模板md',
          component: 'Switch'
        },
        {
          field: 'markdown.mix_id',
          label: '图文模板id',
          bottomHelpMessage: '图文模板使用的md模板id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '114_514',
          }
        },
        {
          field: 'markdown.mix_text',
          label: '图文模板文字参数',
          bottomHelpMessage: '图文模板使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'text模板参数格式：# {{.text}}![{{.imgsize}}]({{.imgurl}})',
          }
        },
        {
          field: 'markdown.mix_px',
          label: '图文模板大小参数',
          bottomHelpMessage: '图文模板使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'imgsize模板参数格式：# {{.text}}![{{.imgsize}}]({{.imgurl}})',
          }
        },
        {
          field: 'markdown.mix_url',
          label: '图文模板链接参数',
          bottomHelpMessage: '图文模板使用的md模板参数',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'imgurl模板参数格式：# {{.text}}![{{.imgsize}}]({{.imgurl}})',
          }
        },
        {
          component: 'Divider',
          label: '官机代发设置'
        },
        {
          field: 'msgServer.sendcmd',
          label: '发送响应指令',
          bottomHelpMessage: '数据账号用来发送获取MsgID时发送的指令',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '填入指令名',
          }
        },
        {
          field: 'msgServer.callcmd',
          label: '官机回应指令',
          bottomHelpMessage: '官方bot用来回应获取MsgID时发送的指令',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '填入指令名',
          }
        },
        {
          field: 'msgServer.open',
          label: '官机代发模式',
          bottomHelpMessage: '使用官机代发消息，仅群消息可用',
          component: 'Switch'
        },
        {
          field: 'msgServer.userbot',
          label: '代发数据账号',
          bottomHelpMessage: '用来接收消息数据的账号',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '填入QQ号',
          }
        },
        {
          field: 'msgServer.robot',
          label: '代发发送账号',
          bottomHelpMessage: '用来发送息数据的账号',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '填入QQ号',
          }
        },
        {
          field: 'msgServer.group',
          label: '代发群白名单',
          bottomHelpMessage: '填写真·QQ群号',
          component: 'GTags',
          componentProps: {
            allowAdd: true,
            allowDel: true,
          },
        },
        {
          component: 'Divider',
          label: '智能体聊天设置'
        },
        {
          field: 'chat.appid',
          label: '智能体appid',
          bottomHelpMessage: '智能体id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '请输入智能体id',
          }
        },
        {
          field: 'chat.token',
          label: '智能体token',
          bottomHelpMessage: '智能体token',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '请输入智能体token',
          }
        }
      ],
      async getConfigData() {
        let config = await cfg.getConfig(`air`, `config`)
        return config;
      },
      async setConfigData(data, { Result }) {
        // 1.读取现有配置文件
        const configFilePath = path.join(__dirname, 'config', 'air.config.yaml');
        let config = {};
        if (fs.existsSync(configFilePath)) {
          const configContent = fs.readFileSync(configFilePath, 'utf8');
          config = yaml.parse(configContent) || {};
        }
        // 2. 更新配置对象
        for (const [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value);
        }
        // 3. 将更新后的配置对象写回文件
        // const updatedConfigYAML = yaml.stringify(config);
        // fs.writeFileSync(configFilePath, updatedConfigYAML, 'utf8');
        await cfg.saveSet('air', 'config', 'config', config)
        logger.mark(`[AIR:配置文件]配置文件更新`)
        return Result.ok({}, '保存成功~');
      }
    }
  }
}