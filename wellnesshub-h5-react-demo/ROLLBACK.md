# 版本与回退说明

当前维护工程：`/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo`

| 版本 | 用途 | 快照目录 |
| --- | --- | --- |
| v0.2.14 | 首页交互、阶段详情与双次形态模拟 | `../wellnesshub-h5-react-demo-versions/v0.2.14-home-motion-20261015` |
| pre-v0.2.14 | 首页交互调整前完整 v0.2.13 工作区 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.14-home-motion-20261015` |
| v0.2.13 | 国内绑定页统一登录布局 | `../wellnesshub-h5-react-demo-versions/v0.2.13-cn-auth-layout-20261015` |
| pre-v0.2.13 | 国内绑定页布局调整前 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.13-cn-auth-layout-20261015` |
| v0.2.12 | 国内微信登录可用性降级与通知兜底 | `../wellnesshub-h5-react-demo-versions/v0.2.12-cn-wechat-resilience-20261015` |
| pre-v0.2.12 | 国内微信登录可用性补齐前的 v0.2.11 基线 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.12-cn-wechat-resilience-20261015` |
| v0.2.11 | 最近 7 次纵向身体状态首页 | `../wellnesshub-h5-react-demo-versions/v0.2.11-longitudinal-home-20261015` |
| pre-v0.2.11 | 纵向首页改造前的 v0.2.10 基线 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.11-longitudinal-home-20261015` |
| v0.2.10 | 国内老用户扫码直达报告与通知回看并行 | `../wellnesshub-h5-react-demo-versions/v0.2.10-existing-scan-and-notification-20261015` |
| pre-v0.2.10 | 两条老用户入口并行修正前的 v0.2.9 基线 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.10-existing-scan-and-notification-20261015` |
| v0.2.9 | 国内老用户通知直达指定报告 | `../wellnesshub-h5-react-demo-versions/v0.2.9-cn-existing-notification-direct-20261015` |
| pre-v0.2.9 | 国内老用户路径修正前的 v0.2.8 基线 | `../wellnesshub-h5-react-demo-versions/pre-v0.2.9-existing-notification-direct-20261015` |
| v0.2.8 | 国内微信认证前分流与标准 H5 合流 | `../wellnesshub-h5-react-demo-versions/v0.2.8-cn-wechat-unified-20261014` |
| pre-v027-cn-unified | 国内登录流程合流改造前的完整未发布 v0.2.7 工作区 | `../wellnesshub-h5-react-demo-versions/pre-v027-cn-unified-20261014` |
| v0.2.6 | 登录页游客模式按钮与底部说明清理 | `../wellnesshub-h5-react-demo-versions/v0.2.6-guest-mode` |
| pre-v025 | 游客入口视觉优化前基线 | `../wellnesshub-h5-react-demo-versions/pre-v025-guest-cta` |
| v0.2.5 | 游客入口次级按钮视觉优化 | `../wellnesshub-h5-react-demo-versions/v0.2.5-guest-cta` |
| pre-v024 | 游客文案精简前基线 | `../wellnesshub-h5-react-demo-versions/pre-v024-guest-copy` |
| v0.2.4 | 游客文案精简与字段校验提示 | `../wellnesshub-h5-react-demo-versions/v0.2.4-guest-copy` |
| pre-guest | 本次游客调整前的全部未发布工作 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/pre-guest-20261013` |
| v0.2.3 | 单份测量游客访问及已有视觉迭代 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/v0.2.3-20261013` |
| v0.1.0 | 本次修改前的基线 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/v0.1.0-baseline-20260914-150323` |
| v0.2.0 | 本次首页改造交付 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/v0.2.0-20260914-154157` |
| v0.2.1 | 服务双状态、隔离预览、多色图标与模型旋转 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/v0.2.1-20260914-190055` |
| v0.2.2 | 登录方式布局统一与 Logo 修复 | `/Users/kean/Documents/wellnesshub/wellnesshub-h5-react-demo-versions/v0.2.2-20260917` |

两个目录都应保持只读使用，不在快照内开发，不覆盖同名版本。本工程目前没有 Git 仓库，目录快照才是可恢复版本；仅改 package.json 不能完成回退。

## 安全恢复流程

可直接要求维护者：“回退原版到 v0.1.0，先备份当前改动”。执行时依次：

1. 确认目标是原版，不是“童允强版本”。停止原版预览进程，避免恢复时继续读写。
2. 将当时的完整工作目录保存为新的时间戳备份（包括未发布改动）；确认备份存在且内容一致。不要直接清空或覆盖当前工作。
3. 将原工作目录移至一个未使用的保留路径，再把所选快照完整复制到原工作路径。这样恢复失败仍能取回原工作。
4. 在恢复后的原路径安装依赖：`npm ci`。快照保留锁文件，但不包含 node_modules。
5. 运行 `npm run check:runtime`、`npm run build`、`npm run test:sites`。v0.2.0 及以上还应运行 `npm run test:home`；v0.1.0 没有新增的首页数据测试命令。
6. 在原预览地址启动并检查首页。保留回退前的目录，不立即删除。

不要使用 `rm -rf`、`git reset --hard` 或未备份的同步覆盖操作。

## 快照内容

包含源代码、public 资源、依赖清单及锁文件、构建／运行配置、运行时校验文件、测试与项目文档；排除 node_modules、dist、test-results、playwright-report 和 .DS_Store。快照不包含浏览器会话或服务端数据。

## 浏览器数据不随代码回退

- v0.2.3 游客上下文只在当前标签页 `sessionStorage`；用“退出游客查看”清除。注册账号数据键保持不变，只有旧 role=guest 的普通登录标记被废弃。

- 本期没有改名、迁移或清空原有偏好、档案、报告和登录键。
- 新增服务键为 `wellnesshub.home-services.v1`，v0.2.0 只读取它；v0.1.0 会忽略它，不要求删除。
- v0.2.1 的 `#/preview/*` 使用内存示例，只读取语言与主题偏好；预览不会写入或迁移个人数据，回退无需清理预览数据。
- 代码回退不会恢复被用户删除的报告，也不会清除登录会话。不要为回退清空浏览器 localStorage。
- 若未来需要数据迁移，先单独备份相关业务数据与偏好，不导出会话令牌。测试数据只存在隔离的 `127.0.0.1:4176`，不写入用户 `localhost:4173`。

## 已执行的独立恢复验证

2026-09-14，将 v0.1.0 基线复制到 `/tmp/wellnesshub-v010-restore.0bon2T`，执行 `npm ci --ignore-scripts --prefer-offline --no-audit --no-fund`，随后运行时 28 文件校验、TypeScript 检查及完整生产构建通过。此临时目录仅作恢复演练，不是长期备份。构建的大包警告属于基线既有问题，未隐藏或放宽检查。
