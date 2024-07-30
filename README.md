
[![伊蕾娜](https://gd-hbimg.huaban.com/376b918e109d20d83556a9d76c7b2e91dbfede1dd3d24-Tkqbpl)](https://github.com/lengxi-root/air-plugin)

# Yunzai air-Plugin

云崽机器人插件，主要适配官方机器人，搭配TRSS云崽的QQbot使用

> 此分支对于私域机器人有特殊适配，公域机器人请选择另一个分支  
> 推荐使用锅巴插件来配置Air-plugin

[![Stars](https://img.shields.io/github/stars/lengxi-root/air-plugin?color=yellow&label=收藏)](../../stargazers)  
[![访问量](https://moe-counter.glitch.me/get/@lengxi-root-air-plugin?theme=rule34)](https://github.com/lengxi-root/air-plugin)

</div>

## 安装教程

1. 准备：[Yunzai-Bot](https://github.com/TimeRainStarSky/Yunzai)

2. 选择安装方式

在云崽根目录执行

> 使用Github安装
```
git clone -b main --depth=1 https://github.com/lengxi-root/air-plugin.git ./plugins/air-plugin/
```

> [!tip]
> 如果您的网络环境较差，建议使用代理加速
> ```
> git clone --depth=1 https://mirror.ghproxy.com/https://github.com/lengxi-root/air-plugin.git ./plugins/air-plugin/
> ```

> 使用Gitee安装（同步可能较慢）
```
git clone -b main --depth=1 https://gitee.com/lengxihddj/air-plugin.git ./plugins/air-plugin/
```

3.安装依赖

> 以下方法任选其一，在air-plugin目录运行  
> 先在云崽根目录执行`cd ./plugins/air-plugin`
<details><summary>1.使用pnpm - 推荐</summary>

```
# 安装pnpm，已安装可跳过（应该都安装了吧，不安装怎么运行云崽）
npm i pnpm -g
```
```
pnpm i
```

</details>
<details><summary>2.使用yarn - 速度快</summary>

```
# 安装yarn，已安装可跳过
npm i yarn -g
```
```
yarn
```
</details>
<details><summary>3.使用npm</summary>

```
npm i
```

</details>

4.使用VST QQ msg url 任选一种

<details><summary>1.展开</summary>
<br>
  
请进入群聊953774387 发送下方消息 appid换成自己机器人的appid
```
#校验appid
```

进行创建你机器人appid的校验文件，进入机器人后台把
```
vst.qqmsg.cn/url
```
输入进 消息url配置 然后在锅巴设置里 把下面内容输入到 消息url配置
```
https://vst.qqmsg.cn/url?url=
```

</details>
<details><summary>2.展开</summary>
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

<details><summary>3.展开-暂时无法使用</summary>
<br>
  
带上自己的机器人appid进入该网站
```
https://url.oxoll.cn?appid=你的appid
```

进入机器人后台把下方内容输入进 消息url配置
```
url.oxoll.cn/url
```

然后在锅巴设置里 把下方内容输入到 消息url配置
```
https://url.oxoll.cn/url?qqbotid=需要替换的appid&url=
```
记得appid提前换成自己机器人的appid

</details>


## 使用教程

发送`#air帮助`查看帮助菜单

> 均支持 `#` 或 `/` 前缀  
> 注意：截止`2024-7-28`测试Ark功能仅能在`私域机器人`使用

<details><summary>伊蕾娜图片</summary>

- `#随机伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/4c3605aac02da41f1dcb4553b815f421f6854eafc0cab-oRwyzu)](https://github.com/lengxi-root/air-plugin)

- `#今日伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/b2ff276348b68e0ed02241955131d34fd87978c173741-1IVYXz)](https://github.com/lengxi-root/air-plugin)

- `#表情伊蕾娜`

[![伊蕾娜](https://gd-hbimg.huaban.com/bf14ef2e02c8c14adb5f19d6a0073e9c3c9814eb95df9-LqnarO)](https://github.com/lengxi-root/air-plugin)

</details>

<details><summary>QQ智能体</summary>

- chat功能需要在[腾讯元器](https://yuanqi.tencent.com/)申请智能体
- 按照调用示例所给的东西填入config
- "user_id: 智能体用户id，在调用示例里面查看user_id"
- "appid: 智能体id, token: 智能体token"
- #CE + `问题`

[![伊蕾娜](https://gd-hbimg.huaban.com/491c06d1eac04b4a4e991bc8856ed7d1b40213ce51cad-KqdVKB)](https://github.com/lengxi-root/air-plugin)

</details>

<details><summary>全局转Ark</summary>

| 原内容 | 转换后 |
| - | - |
| 纯文本 | 文本卡片 |
| 带链接文本 | 文本链接卡片 |
| 图片 | 大图卡片 |

注意：正确配置消息url以体验完整版(不然发不出去

> 使用锅巴插件

在锅巴插件配置打开`全局转Ark`然后保存

> 手动配置

- 找到`config/air.config.yaml`添加以下内容
- `msgReset: true`

</details>

<details><summary>Mikan - 蜜柑计划</summary>

> 蜜柑计划推送  
> 由于此功能消息比较长，不适合在`官方Bot`使用  
> （可能会更新订阅推送功能）

- `#来点新番`
- `#蜜柑推送`
- （功能是一样的）

</details>

<details><summary>更新插件</summary>

- `#air(强制)更新`
- `#air版本`

</details>

## 联系方式

- 班级群(bushi： [632910692](https://jq.qq.com/?_wv=1027&k=A2f9grK0)
- url配置发送申请群(shi?： [953774387](https://qm.qq.com/q/U0aaXRCzce)

### 开发者 & 赞助支持

- 冷曦：[GitHub](https://github.com/lengxi-root) | [Gitee](https://gitee.com/lengxihddj) |  [QQ：2218872014](https://qm.qq.com/q/44OFS6WBKM)
- TS沂沨：[GitHub](https://github.com/Ts-yf) | [Gitee](https://gitee.com/Ts-yf) |  [QQ：1918530969](https://qm.qq.com/q/l7nDOOUQL)

