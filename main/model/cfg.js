import yaml from 'yaml';
import fs from 'fs'


function getconfig(file, name) {
  const _path = process.cwd().replace(/\\/g, '/')
  let cfgyaml = `${_path}/plugins/air-plugin/${file}/${name}.yaml`
  const configData = fs.readFileSync(cfgyaml, 'utf8');
  let config = yaml.parse(configData);
  return { config };
}

export default getconfig;