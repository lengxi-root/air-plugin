import YAML from "yaml";
import fs from "node:fs";
import chokidar from "chokidar";
import lodash from "lodash";
import { promisify } from 'node:util';
import { dirPath } from './dir.js'

class XsCfg {
  constructor() {
    /** 默认设置 */
    this.defSetPath = dirPath + "/main/config_def/";
    this.defSet = {};

    /** 用户设置 */
    this.configPath = dirPath + "/config/";
    this.config = {};

    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} };
  }

  /** 检查默认配置 */
  async start() {
    if (!fs.existsSync(this.getFilePath("air", "msgServer"))) {
      fs.copyFile(this.getFilePath("air", "msgServer", "defSet"), this.getFilePath("air", "msgServer"), (err) => {
        if (err) throw err;
      });
    };
    if (!fs.existsSync(this.getFilePath("air", "config"))) {
      fs.copyFile(this.getFilePath("air", "config", "defSet"), this.getFilePath("air", "config"), (err) => {
        if (err) throw err;
      });
    };
  }

  /**
   * @param app  功能
   * @param name 配置文件名称
   */
  getdefSet(app, name) {
    return this.getYaml(app, name, "defSet");
  }

  /** 用户配置 */
  async getConfig(app, name) {
    return {
      // ...this.getdefSet(app, name),
      ...this.getYaml(app, name, "config"),
    };
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认配置-defSet，用户配置-config
   */
  getYaml(app, name, type) {
    let file = this.getFilePath(app, name, type);
    let key = `${app}.${name}`;
    if (this[type][key]) return this[type][key];
    let fss
    try {
      fss = fs.readFileSync(file, "utf8")
    } catch {
      return {};
    }
    this[type][key] = YAML.parse(fss);
    this.watch(file, app, name, type);
    return this[type][key];
  }

  getFilePath(app, name, type) {
    if (type == "defSet") return `${this.defSetPath}${app}/${name}.yaml`;
    else return `${this.configPath}${app}.${name}.yaml`;
  }

  /** 监听配置文件 */
  watch(file, app, name, type = "defSet") {
    let key = `${app}.${name}`;

    if (this.watcher[type][key]) return;

    const watcher = chokidar.watch(file);
    watcher.on("change", (path) => {
      delete this[type][key];
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`);
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]();
      }
    });

    this.watcher[type][key] = watcher;
  }

  saveSet(app, name, type, data) {
    let file = this.getFilePath(app, name, type);
    if (lodash.isEmpty(data)) {
      fs.existsSync(file) && fs.unlinkSync(file);
    } else {
      let yaml = YAML.stringify(data);
      fs.writeFileSync(file, yaml, "utf8");
    }
  }


  /**获取Yunzai分支名*/
  async getYunzaiName() {
    let yunzaiName = null;
    const readFileAsync = promisify(fs.readFile);
    if (!yunzaiName) {
      yunzaiName = await readFileAsync('./package.json')
        .then(data => JSON.parse(data))
        .then(pmcfg => pmcfg?.name || 'Yunzai-Bot')
        .catch(() => 'Yunzai-Bot');
    }
    return yunzaiName;
  }

}

export default new XsCfg();
