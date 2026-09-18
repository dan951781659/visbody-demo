# 首次启动与权限流程 Demo

## 入口

运行 `npm run web -- --port 8081 --localhost`。

- 首次访问任意页面：欢迎页 → 协议说明 → 同意后继续原页面。
- `/permissions`：平台、地区、语言、权限模拟状态、重置首次启动。
- `/connect/discover`：同一局域网发现与连接。
- `/connect/scan`：先通过模拟相机授权，再开始原模拟扫码。
- `/installation`：Android 商店／APK、iOS App Store 安装步骤。
- `/media-demo`：照片选择器、拍摄头像、保存报告演示。
- `/legal?kind=terms`、`/legal?kind=privacy`：示例协议。

个人中心设置、设备列表、设备添加菜单、编辑资料均已接入对应入口；Web 报告保存进入媒体流程演示。原生报告保存仍使用原逻辑，不将模拟授权误当成系统授权。

## 行为与边界

- 协议不默认勾选。不同意停留欢迎页，重新打开仍需同意。
- 根级 WelcomeGate 在业务 providers 和路由页面挂载前检查同意状态，未同意不会启动扫码定时器。原 URL（含查询参数）保留，同意后继续。
- 存储键 `motionstation.experience-demo.v1`；记录协议版本、平台、语言、地区与按平台区分的模拟权限。重置只修改该键，不删除其他存储键。模拟设备连接沿用原 TrainingContext 内存状态，刷新不保证保留设备。
- 首次请求直接显示一个“允许／不允许”授权演示弹窗，用途说明包含在同一弹窗内；系统拒绝后提供模拟设置恢复。Android 与 iOS 状态隔离。
- 欢迎弹窗与权限页的协议入口使用蓝色文字链接，点击仅阅读协议，不触发同意。
- Android 13–16 的普通局域网访问场景不强制申请蓝牙、定位或附近 Wi-Fi 权限。蓝牙场景独立演示附近设备授权。
- iOS 局域网发现演示本地网络权限；保存报告演示仅添加照片；照片选择器不演示全相册读取权限。
- 相机、蓝牙、照片和网络弹窗均为应用内模拟。没有安装包、网络发现、真实摄像头或相册写入。未修改 app.json 或添加原生 SDK。
- 新增流程中英双语，现有业务页不在全量翻译范围。海外当前复用已有 US 地区枚举，不表示政策已覆盖所有国家。
- 安装流程仅作说明，不操作系统安装来源、安全保护或企业信任。

## 已执行验收（2026-09-18）

- TypeScript：`npm run lint` 通过。
- Web 编译成功，实际浏览器操作验证以下流程：
  - 深链进入欢迎页；不同意后停留；协议详情往返；同意恢复局域网页。
  - Android Wi-Fi 关闭、无设备、连接失败；iOS 拒绝 → 设置恢复 → 发现 → 连接成功。
  - 刷新保留同意、平台、语言和授权；再次搜索不重复弹权限。
  - 相机拒绝后扫码不自动完成。
  - iOS 照片选择器及仅添加照片授权；蓝牙关闭提示与 Android 附近设备授权。
  - iOS 安装步骤；Android APK 来源说明与取消。
  - 中文／英文、地区切换；重置返回欢迎；390×844 欢迎弹窗完整可见。
- 截图：`welcome.png`、`ios-permission.png`、`lan-connected.png`。

## 原生发布前待核验

本次验收不代表 Android／iOS 真机授权、设备协议互通或商店审核已通过。

- 按真实 target SDK、系统版本和局域网发现 API 核验权限，尤其 Android 后续版本的本地网络访问限制。
- 核验 iOS 本地网络用途描述、Bonjour 服务与实际协议配置。
- 确认设备断网／隔离网络、应用后台恢复、系统撤销权限、不可再次请求状态。
- 替换正式用户协议与隐私政策；明确运营主体、实际收集处理与地区要求。
- 项目启动原有 Expo 依赖兼容提示仍存在（file-system、media-library 等），正式原生构建前需单独完成版本对齐与真机验证。

参考：
- https://developer.android.com/training/permissions/requesting
- https://developer.android.com/develop/connectivity/bluetooth/bt-permissions
- https://developer.android.com/privacy-and-security/local-network-permission
- https://developer.apple.com/documentation/technotes/tn3179-understanding-local-network-privacy
- https://developer.apple.com/documentation/PhotoKit/selecting-photos-and-videos-in-ios

## 简化流程复验

- 首次授权直接显示允许／不允许，无用途说明前置弹窗；Android 相机拒绝及设置恢复、iOS 本地网络单弹窗已验证。
- 中英文正文蓝色协议链接可进入详情，返回仍显示原弹窗，点击不触发同意。
- 390×844 手机尺寸已验证，欢迎与 iOS 授权截图已更新。
- TypeScript 检查通过。
