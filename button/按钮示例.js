import { makeBtn } from '../lib/button.js';

export default class Button {
  constructor () {
    this.plugin = {
      // 插件名称
      name: '按钮示例',
      // 描述
      dsc: '按钮示例',
      // 按钮优先级
      priority: 100,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^哈哈哈',
          /** 执行方法 */
          fnc: 'test'
        },
      ]
    }
  }

  /** 执行方法 */
  test (e) {
    const button = []
  
    const list1 = [  // 方法1: 传入二维数组，适用于不定列数按钮
      [
        { label: '0.0' },  // 外显和内容相同的按钮
        { label: '0.1' , enter: true },  // 外显和内容相同的回车按钮
        { label: '0.2' , data: 'test1' },  // 外显和内容不同的按钮
        { label: '0.3' , callback: 'test2' },  // 外显和内容不同的回车按钮
      ],
      [  
        { label: '1.0' , link: 'https://im.qq.com/index/' },  // 跳转到链接的按钮

        /* style: 0 - 灰色线框, 1 - 蓝色线框 */
        { label: '1.1' , style: '0' },  // 灰色线框按钮

        /* type: 0 - http或小程序, 1 - 回调后台接口, 2 - 自动在输入框 @bot data */
        { label: '1.2' , type: '1' },  // 回调后台接口的按钮

        /* permission.type: 0 - 指定用户可操作(群, 需填写specify_user_ids), 1 - 仅管理者可操作, 2 - 所有人可操作, 3 - 指定身份组可操作(频道, 需填写specify_role_ids) */
        { label: '1.3' , permission: { type: '0' , specify_user_ids: [ e.user_openid ] } },  // 附带权限的按钮

        { label: '1.4' , data: 'test4' , style: '0' , type: '1' , permission: { type: '0' , specify_user_ids: [ e.user_openid ] } },
      ],
    ]
    button.push(...makeBtn(list1))  // 调用makeBtn制作按钮

    const list2 = [  // 方法2: 传入一维数组，适用于固定列数的按钮
      { label: '0' },
      { label: '1' },

      { label: '2' },
      { label: '3' },

      { label: '4' },
    ]
    button.push(...makeBtn( list2 , 2 ))  // 调用makeBtn制作按钮，第二个参数为固定列数

    return button  // 返回制作完成的按钮
  }
}