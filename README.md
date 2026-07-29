# MotionStation Mobile

Expo + React Native 移动端原型。

## 本地预览（同一 Wi‑Fi）

```bash
npm install
npm start
```

若扫码后连不上，可能是 VPN/代理导致 IP 错误，可指定本机局域网 IP：

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=10.88.20.84 npm start
```

将 `10.88.20.84` 换成你 Mac 的实际 IP（终端运行 `ifconfig | grep "inet "` 查看）。

## 局域网扫码预览（无需 Expo Go，推荐）

手机与电脑连**同一 Wi‑Fi**，扫终端二维码后用浏览器打开即可，**不用装 Expo Go**。

```bash
npm run share:lan
```

会自动：打包 Web 静态站 → 在 `0.0.0.0:4173` 起服 → 打印局域网地址与二维码。

| 项 | 说明 |
|---|---|
| 预览者 | **无需安装**，Safari / Chrome 扫码打开 |
| 网络 | 手机与电脑同一局域网 |
| 你的电脑 | 需保持命令运行；`Ctrl+C` 结束 |
| 体验 | UI 基本一致；毛玻璃等少数原生效果在 Web 上略有差异 |

已打包过、只想重新起服：

```bash
npm run share:lan:serve
```

若扫码打不开，多半是 VPN/错误网卡 IP。可先 `ifconfig | grep "inet "` 确认局域网 IP，再在手机浏览器手动打开 `http://你的IP:4173`。

---

## 远程分享预览

### 方式 A：Expo Go 扫码（原生体验，需安装）

适用于把二维码或链接发给其他城市的同事/客户，对方需安装 **Expo Go（SDK 54）**。

```bash
npx expo login          # 建议先登录，Tunnel 更稳定
npm run start:share     # 公网 Tunnel + 清缓存
```

终端会出现 **Tunnel** 地址，二维码可截图发给对方扫码。

| 项 | 说明 |
|---|---|
| 预览者 | 必须安装 **Expo Go** |
| 你的电脑 | 需保持命令运行，关闭后他人无法访问 |
| 体验 | 最接近真机 App |

### 方式 B：公网浏览器链接（无需安装）

对方**不用装 Expo Go**，用手机 **Safari / Chrome** 打开链接即可。

**步骤 1：打包 Web 版**

```bash
npm run export:web
```

会在项目里生成 `dist-web/` 静态文件。

**步骤 2：部署到公网（任选其一）**

- **Vercel（推荐）**：把 `dist-web` 目录拖到 [vercel.com](https://vercel.com) 部署，获得 `https://xxx.vercel.app` 链接
- **Netlify Drop**：把 `dist-web` 拖到 [app.netlify.com/drop](https://app.netlify.com/drop)
- **临时穿透**：`npm run share:lan` 起服后，再用 Cloudflare Tunnel 等把 `4173` 暴露到公网

**步骤 3：把 HTTPS 链接发给对方**

对方在手机浏览器打开即可，无需安装任何 App。

| 项 | 说明 |
|---|---|
| 预览者 | **无需安装**，浏览器即可 |
| 你的电脑 | 部署到 Vercel/Netlify 后**不用一直开着** |
| 体验 | UI 基本一致；毛玻璃等少数原生效果在 Web 上略有差异 |

### 方式 C：安装独立 App（后期正式交付）

若需要「像正式 App 一样安装、不依赖 Expo Go」，需走 **EAS Build** 打 iOS/Android 安装包（TestFlight / APK）。适合评审后期，不适合快速改 UI 的原型阶段。

### 脚本对照

| 命令 | 用途 |
|---|---|
| `npm run share:lan` | **局域网扫码预览（无需 Expo Go）** |
| `npm run share:lan:serve` | 仅起服，不重新打包 |
| `npm start` | 局域网 Expo Go 预览 |
| `npm run start:share` | 公网 Expo Go 扫码（需对方装 Expo Go） |
| `npm run export:web` | 打包 Web 静态站 |
| `npm run preview:web` | 本机/局域网预览 Web 包（无二维码） |

## 本地 Web 开发预览

```bash
npm run web
```

Web 模式使用 `app.json` 中 `"web.output": "single"`。

## 项目结构

```
app/                 Expo Router 路由
  (tabs)/            四栏 Tab 页面
src/
  theme/             设计令牌
  data/mockData.ts   Mock 数据
  components/        UI 组件
```
