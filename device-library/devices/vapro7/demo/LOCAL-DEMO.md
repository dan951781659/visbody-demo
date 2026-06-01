# 本地部署（WellnessHub 后台 Demo + VAPro7 设备 Demo）

## 一键打开（推荐）

| 方式 | 操作 |
|------|------|
| **Windows** | 双击 **`一键打开-WellnessHub测量配置.bat`** → 会用系统默认浏览器打开后台 Demo |
| **macOS** | 双击 **`一键打开-WellnessHub测量配置.command`**（首次若提示权限，到「隐私与安全性」允许） |
| **已在浏览器中** | 先打开本目录下的 **`点此打开-WellnessHub测量配置.html`**，会自动跳转到后台 Demo（相对路径，无需改地址） |

> 说明：网上分享的 `http://...` 链接无法指向你电脑里的文件；**可点击的相对链接**只在「已打开同目录下某一页」时有效，因此上面用 `.bat` / `.command` 实现真正的「点一下就开」。

## 为什么用「记事本」打不开？

**记事本（Notepad）只能编辑文本**，会把 `.html` 当成源码打开，**不会渲染网页**，所以看起来就像「一堆代码」，没有后台界面。

请用 **浏览器** 查看 Demo：

- 在资源管理器中 **右键** `wellnesshub-measurement-config-demo.html` → **打开方式** → 选 **Microsoft Edge** 或 **Google Chrome**。
- 若双击总是用记事本打开：Windows **设置 → 应用 → 默认应用 → 按文件类型选择默认值**，找到 **.html**，把默认应用改成浏览器。

联调时更推荐下面「先起本地服务再在地址栏访问」，避免 `file://` 与 `localStorage` 在部分环境下的限制。

本目录同时包含 **VAPro7 设备端静态页** 与 **WellnessHub 门店「测量项目与报告配置」单页 Demo**（`wellnesshub-measurement-config-demo.html`）。请用**同一站点**（同一协议、主机、端口）托管，这样后台保存时写入的 `localStorage['vapro7-measurement-config']` 与设备页 `shared.js` 读取的键一致（同源）。

### Windows 一键起服务（可选）

在本目录双击运行 [`open-demo.bat`](./open-demo.bat)（需已安装 [Node.js](https://nodejs.org/)）：会新开一个窗口跑静态服务，并尝试用默认浏览器打开总览页。后台 Demo 地址：  
`http://127.0.0.1:5173/wellnesshub-measurement-config-demo.html`

## 启动方式（任选其一）

在项目根目录或本目录执行均可，**根路径指向本目录** `device-library/devices/vapro7/demo`：

```bash
cd device-library/devices/vapro7/demo
npx --yes serve . -l 5173
```

浏览器访问：

- 设备总览：[http://127.0.0.1:5173/index.html](http://127.0.0.1:5173/index.html)
- 设备首页：[http://127.0.0.1:5173/home.html](http://127.0.0.1:5173/home.html)
- 后台测量配置 Demo：[http://127.0.0.1:5173/wellnesshub-measurement-config-demo.html](http://127.0.0.1:5173/wellnesshub-measurement-config-demo.html)

或使用 Python 内置静态服务：

```bash
cd device-library/devices/vapro7/demo
python3 -m http.server 8080 --bind 127.0.0.1
```

对应地址将端口改为 `8080` 即可。

## 联调顺序建议

1. 打开 `wellnesshub-measurement-config-demo.html` 调整开关：**每次界面刷新预览时**都会写入 `vapro7-measurement-config`，与设备端同开时刷新 `home.html` 即可看到入口变化。点击 **确定** 会额外持久化 WellnessHub Demo 自身状态（`wellnesshub_measurement_config_demo_v6`）并再次同步设备键。指定设备覆盖在 Demo 中按 **SN（单台）** 勾选，同一型号下多台可分别保存不同覆盖；当前仍只向设备键写入**一份**预览 payload（联调单页）。
2. 同标签页或新标签打开 `home.html` / `report-scan-login.html` / `report-detail.html`，刷新即可看到入口与结束测量支路、报告卡片随配置变化。

## 与 pm-ai-playbook 源文件的关系

仓库内的 `wellnesshub-measurement-config-demo.html` 由 playbook 示例复制而来，便于同仓联调。若你在 `pm-ai-playbook/projects/wellnesshub/examples/measurement-config-demo.html` 修改了权威版本，请再执行一次复制覆盖本文件：

```bash
cp "/Users/kean/维塑/New project/pm-ai-playbook/projects/wellnesshub/examples/measurement-config-demo.html" \
   "device-library/devices/vapro7/demo/wellnesshub-measurement-config-demo.html"
```

（请按你本机路径调整。）
