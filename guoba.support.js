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
      description: `伊蕾娜api与全局Ark卡片消息转换`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(__dirname, 'main/helps/icon.png')
    },
    configInfo: {
      schemas: [
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
          field: 'MsgUrl',
          label: '消息url配置',
          bottomHelpMessage: '非必填，请看README.md设置教程和搭建服务，如没有备案域名请进群953774387',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '如：https://vst.qqmsg.cn/url?url=',
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
          label: '按钮白名单',
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
          field: 'markdown.template',
          label: 'Markdown模板id',
          bottomHelpMessage: 'DAU2000以上的机器人申请md资格可用（本插件暂不支持）',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '为什么不支持模板md？因为插件作者没有DAU2000的机器人来测试☝️🤓',
          }
        },
        {
          component: 'Divider',
          label: '智能体聊天设置'
        },
        {
          field: 'chat.user_id',
          label: '智能体user.id',
          bottomHelpMessage: '智能体用户id，在调用示例里面查看user_id',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '请输入user.id',
          }
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
        },
        {
          component: 'Divider',
          label: 'Mikan-蜜柑计划'
        },
        {
          field: 'Mikan.withProxy',
          label: '使用代理',
          bottomHelpMessage: '是否使用代理访问',
          component: 'Switch'
        },
        {
          field: 'Mikan.Proxy',
          label: '代理地址',
          bottomHelpMessage: '使用镜像站请修改下面RSS地址',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '使用代理访问的地址',
          }
        },
        {
          field: 'Mikan.url',
          label: 'RSS地址',
          bottomHelpMessage: 'RSS地址，默认为主站https://mikanani.me',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: '如：https://mikanani.me',
          }
        },
        {
          field: 'Mikan.token',
          label: '蜜柑订阅Token',
          bottomHelpMessage: '自行获取RSS订阅Token，“%2b”替换为“+”，“%3d%3d”替换为“==”',
          component: 'Input',
          required: false,
          componentProps: {
            placeholder: 'https://mikanani.me/RSS/MyBangumi?token=后面的内容',
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