import fs from "node:fs/promises"
import YAML from "yaml"
import _ from "lodash"
import { basename, pluginPath } from './tool.js'

export default async function(name, config, keep) {
  const configFile = `${pluginPath}/config/${name}.yaml`
  const configSave = () => fs.writeFile(configFile, YAML.stringify(config), "utf8")

  let configData
  try {
    configData = YAML.parse(await fs.readFile(configFile, "utf8"))
    _.merge(config, configData)
  } catch (err) {
    logger.debug(basename + "配置文件", configFile, "读取失败", err)
  }
  _.merge(config, keep)

  if (YAML.stringify(config) != YAML.stringify(configData))
    await configSave()
  return { config, configSave }
}
export async function cfg(name) {
  const configFile = `${pluginPath}/config/${name}.yaml`
  let config
  try {
    const yamlFile = await fs.readFile(configFile, 'utf8');
  // 解析 YAML 文件为 JavaScript 对象
   config = YAML.parse(yamlFile);
  } catch (err) {
    logger.warn(basename + "配置文件", configFile, "读取失败", err)
  }

  return config
}