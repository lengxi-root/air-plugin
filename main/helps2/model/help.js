export const helpCfg = {
  themeSet: false,
  title: 'AIR帮助',
  subTitle: 'Miao-Yunzai & AIR-plugin',
  colWidth: 265,
  theme: 'all',
  themeExclude: [
    'default'
  ],
  colCount: 2,
  bgBlur: true
}
export const helpList = [
  {
    group: '伊蕾娜图库+智能体（智能体需要进入锅巴配置token等参数）',
    list: [
      {
        icon: 1,
        title: '/随机伊蕾娜',
        desc: '随机一张伊蕾娜'
      },
      {
        icon: 13,
        title: '/今日伊蕾娜',
        desc: '随机一张伊蕾娜+幸运值'
      },
      {
        icon: 23,
        title: '/表情伊蕾娜',
        desc: '随机一张表情包伊蕾娜'
      },
      { 
        icon: 23,
        title: '/CE+聊天',
        desc: '与混元大模型聊天'}
    ]
  },
  {
    group: 'TTS语音转换（所有人共用40w字token，用完可进入爱发电购买token）',
    list: [
      {
        icon: 9,
        title: '/tts查询**',
        desc: '例如：/tts查询伊蕾娜'
      },
      {
        icon: 9,
        title: '/**转换**',
        desc: '例如：/2298转换你好啊'
      },
      {
        icon: 9,
        title: '/字符字**',
        desc: '例如：/字符字伊蕾娜'
      },
      {
        icon: 9,
        title: '/转换次数',
        desc: '仅主人可用，查询token剩余次数'
      }
    ]
  }
    ]
  
export const style = {
  fontColor: '#8BF4FF',
  fontShadow: 'none',
  descColor: '#eee',
  contBgColor: 'rgba(6, 21, 31, 0.1)',
  contBgBlur: 0,
  headerBgColor: 'rgba(6, 21, 31, 0.35)',
  rowBgColor1: 'rgba(6, 21, 31, 0.25)',
  rowBgColor2: 'rgba(6, 21, 31, 0.25)'
}