import _ from 'lodash'
import Render from '../main/helps2/model/render.js'
import Version from '../main/helps2/model/version.js'
import { helpCfg, helpList, style } from '../main/helps2/model/help.js'

export class help extends plugin {
  constructor () {
    super({
      name: 'air帮助',
      priority: -50,
      rule: [
        /*{
          reg: /^#(air|AIR)版本$/,
          fnc: 'version'
        },*/
        {
          reg: /^#(air|AIR)(.*)帮助$/,
          fnc: 'help'
        }
      ]
    })
  }

  /*async version (e) {
    return await Render.render('help/version-info', {
      currentVersion: Version.version,
      changelogs: Version.changelogs,
      name: 'Lain',
      elem: 'cryo'
    }, { e, scale: 1.2 })
  }*/

  async help (e) {
    if (!e.msg.match(/^#(air|AIR)帮助$/)) {
      return await this.reply(e.msg.replace(/帮助/, '菜单'))
    }
    let helpGroup = []
    _.forEach(helpList, (group) => {
      _.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })

    let themeData = await this.getThemeData(helpCfg, helpCfg)
    return await Render.render('help/index', {
      helpCfg,
      helpGroup,
      ...themeData,
      element: 'default'
    }, { e, scale: 1.6 })
  }

  async getThemeData (diyStyle, sysStyle) {
    let helpConfig = _.extend({}, sysStyle, diyStyle)
    let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
    let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265))
    let width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
    let resPath = '{{_res_path}}/help/imgs/'
    let theme = {
      main: `${resPath}/main.png`,
      bg: `${resPath}/bg.jpg`,
      style
    }
    let themeStyle = theme.style || {}
    let ret = [`
        body{background-image:url(${theme.bg});width:${width}px;}
        .container{background-image:url(${theme.main});width:${width}px;}
        .help-table .td,.help-table .th{width:${100 / colCount}%}
        `]
    let css = function (sel, css, key, def, fn) {
      let val = getDef(themeStyle[key], diyStyle[key], sysStyle[key], def)
      if (fn) {
        val = fn(val)
      }
      ret.push(`${sel}{${css}:${val}}`)
    }
    css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
    css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
    css('.help-desc', 'color', 'descColor', '#eee')
    css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
    css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
    css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
    css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
    css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
    return {
      style: `<style>${ret.join('\n')}</style>`,
      colCount
    }
  }
}

function getDef () {
  for (let idx in arguments) {
    if (!_.isUndefined(arguments[idx])) {
      return arguments[idx]
    }
  }
}
