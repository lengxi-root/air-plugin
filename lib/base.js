import { dirPath, basename, pluginPath } from "./tool.js";
export default class base {
  constructor(e = {}) {
    this.e = e;
    this.userId = e?.user_id;
    this.model = basename;
    this._path = process.cwd().replace(/\\/g, "/");
  }


  /**
   * 截图默认数据
   * @param saveId html保存id
   * @param tplFile 模板html路径
   * @param pluResPath 插件资源路径
   */
  get screenData() {
    return {
      saveId: this.userId,
      tplFile: `${dirPath}/res/html/${this.model}/${this.model}.html`,
      /** 绝对路径 */
      pluResPath: `${pluginPath}/res/`,
    };
  }
}
