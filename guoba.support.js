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
      isV3: true,
      isV2: false,
      description: `伊蕾娜api与其他娱乐功能调用`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(__dirname, 'main/helps/icon.png')
    },
    configInfo: {
      schemas: [
        {
          component: 'Divider',
          label: 'AIR插件设置'
        },
        {
          field: 'Ark',
          label: 'Ark卡片模式',
          bottomHelpMessage: '仅trss官方Bot开启使用，其他请关闭',
          component: 'Switch'
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
          field: 'MsgUrl',
          label: '官方机器人消息url配置,
          bottomHelpMessage: '开启Ark的时候需要，url后面会接上图片地址',
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
        return Result.ok({}, '保存成功~请及时重启云崽应用配置');
      }
    }
  }
}