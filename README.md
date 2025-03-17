
[![伊蕾娜](https://gd-hbimg.huaban.com/376b918e109d20d83556a9d76c7b2e91dbfede1dd3d24-Tkqbpl)](https://github.com/lengxi-root/air-plugin)

# Yunzai Air-Plugin

云崽机器人插件，主要适配官方机器人，搭配TRSS云崽的QQbot使用

> 推荐使用锅巴插件来配置Air-plugin

[![Stars](https://img.shields.io/github/stars/lengxi-root/air-plugin?color=yellow&label=收藏)](../../stargazers)  
[![访问量](https://moe-counter.glitch.me/get/@lengxi-root-air-plugin?theme=rule34)](https://github.com/lengxi-root/air-plugin)

</div>

## 安装教程

## 1. 准备：[Yunzai-Bot](https://github.com/TimeRainStarSky/Yunzai)

## 2. 选择安装方式，在云崽根目录执行

> 使用Github安装
```
git clone -b main --depth=1 https://github.com/lengxi-root/air-plugin.git ./plugins/air-plugin/
```

> [!tip]
> 如果您的网络环境较差，建议使用代理加速
> ```
> git clone --depth=1 https://ghproxy.net/https://github.com/lengxi-root/air-plugin.git ./plugins/air-plugin/
> ```

> 使用Gitee安装（同步可能较慢）
```
git clone -b main --depth=1 https://gitee.com/lengxihddj/air-plugin.git ./plugins/air-plugin/
```

## 3.安装依赖

> air-plugin目录下执行

<details><summary>使用yarn</summary>

> 不推荐npm，pnpm！
> Linux用户可能会有点不一样，自行查找教程

```
# 安装yarn，可使用npm，pnpm等包管理器安装，已安装可跳过
pnpm add yarn 
```
```
pnpm yarn
```
</details>

## 4.使用配置消息url（可选）
> 只是发链接的时候要用的，只有普通文本的时候是不需要的
<details><summary>点击展开</summary>
<br>
  
注意：需要备案域名和ssl证书<br>
进入库内 main/php/ 将url整体放到网站根目录
先把校验文件下载到网站根目录，然后将你的域名网站添加到
```
QQ开放平台-机器人-开发设置-消息url配置
```
然后将你的网站按下方加入到消息url配置中，
```
你的网站域名/url
```

进锅巴添加把你的网站添加到消息url配置中
```
https://你的网站域名/url?url=
```

</details>


## 使用教程

发送`#air帮助`查看帮助菜单

> 均支持 `#` 或 `/` 前缀  

<details><summary>伊蕾娜图片</summary>

- `#随机伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/4c3605aac02da41f1dcb4553b815f421f6854eafc0cab-oRwyzu)](https://github.com/lengxi-root/air-plugin)

- `#今日伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/b2ff276348b68e0ed02241955131d34fd87978c173741-1IVYXz)](https://github.com/lengxi-root/air-plugin)

- `#表情伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/bf14ef2e02c8c14adb5f19d6a0073e9c3c9814eb95df9-LqnarO)](https://github.com/lengxi-root/air-plugin)

</details>
<details><summary>官机代发</summary>
  
- 使用锅巴插件配置 官机代发 相关设置即可
- 使用数据账号接收消息并使用官方机器人发送消息
- 免去频繁艾特官方机器人的步骤
- 第一版，有不少bug，严重恶性bug及时停止插件并进入班级群反馈
> 在Ark白名单内加入数据账号QQ即可使用Ark代发
[![伊蕾娜](https://gd-hbimg.huaban.com/8e68ecad9047f2c8a4a20926dd19fcac59016b779b42-1jnULH)](https://github.com/lengxi-root/air-plugin)

 </details>
<details><summary>QQ智能体</summary>

- chat功能需要在[腾讯元器](https://yuanqi.tencent.com/)申请智能体
- 按照调用示例所给的东西填入config
- "appid: 智能体id, token: 智能体token"
- #CE + `问题`

[![伊蕾娜](https://gd-hbimg.huaban.com/491c06d1eac04b4a4e991bc8856ed7d1b40213ce51cad-KqdVKB)](https://github.com/lengxi-root/air-plugin)

</details>
<details><summary>全局转换模板md</summary>  

### 将云崽发送的消息转换为特定模板md再发送
> 注意：Markdown功能仅能在`公域机器人`使用，需要达到特定DAU数量去申请权限

| 原内容 | 转换后 |
| - | - |
| 纯文本 | 文字模板md |
| 纯图片 | 图片模板md |
| 图文混排 | 图文模板md |

###### 正确配置消息url与图床cookie以体验完整版，否则无法发送包含链接，图片的消息  

> 使用锅巴配置

- 在锅巴插件配置页面找到`air插件`
- 配置好`Markdown类设置`
- 添加`markdown白名单`，填写BotQQ号


</details>

<details><summary>全局转Ark</summary>  

### 将云崽发送的消息转换为特定Ark再发送  
> 注意：截止`2024-7-28`测试Ark功能仅能在`私域机器人`使用，公域的需要达到特定DAU数量去申请权限
  
| 原内容 | 转换后 |
| - | - |
| 纯文本 | 文本卡片 |
| 带链接文本 | 文本链接卡片 |
| 图片 | 大图卡片 |

###### 正确配置消息url与图床cookie以体验完整版，否则无法发送包含链接，图片的消息  

> 使用锅巴配置-推荐

- 在锅巴插件配置页面找到`air插件`
- 打开`全局转Ark`
- 添加`Ark白名单`，填写BotQQ号

> 手动配置

- 在插件目录找到`config/air.config.yaml`使用文本编辑器打开
- 添加以下内容  

```

msgReset: true
Ark_users:
  - 123456789

```

</details>

<details><summary>图床Cookie</summary>

- 前往[花瓣网](https://www.huaban.com)注册并登录
- 自行搜索`获取网页cookie方法`

</details>

<details><summary>更新插件</summary>

- `#air(强制)更新`
- `#air版本`

</details>

## 联系方式

- 班级群： [687976465](https://qm.qq.com/q/PCWuy2zV6u)

### 开发者 & 赞助支持

- 冷曦：[GitHub](https://github.com/lengxi-root) | [Gitee](https://gitee.com/lengxihddj) |  [QQ：2218872014](https://qm.qq.com/q/44OFS6WBKM)
- TS沂沨：[GitHub](https://github.com/Ts-yf) | [Gitee](https://gitee.com/Ts-yf) |  [QQ：1918530969](https://qm.qq.com/q/l7nDOOUQL)


### QQ机器人友链
>  欢迎广大开发者交换友链  

| Robot | 创建人 | 功能&介绍 |
| - | - | - |
| [伊蕾娜](https://qun.qq.com/qunpro/robot/qunshare?biz_type=1&robot_uin=3889045760) | [冷曦](https://qm.qq.com/q/44OFS6WBKM) | 定位：核心为API触发型多功能BOT与其他拓展玩法功能。 |
| [XxxXBot](https://qun.qq.com/qunpro/robot/qunshare?biz_type=1&robot_uin=3889042293) | [TS沂沨](https://qm.qq.com/q/l7nDOOUQL) | 良言一句三冬暖，恶语伤人六月寒。提供一言，情话，毒鸡汤，答案之书等大量语库，再也不为没有文案发朋友圈而发愁。 |
| [玉衡星刻晴](https://bot.q.qq.com/s/917433cnh?id=102131063) | [F246](https://qm.qq.com/q/6dLKCGt6Le) | 璃月七星之「玉衡星」，负责土地规划与建设，以行动力与 革新理念闻名 |
