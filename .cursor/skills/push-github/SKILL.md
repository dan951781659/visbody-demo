---
name: push-github
description: Push the current visbody-demo repo to GitHub and output the GitHub Pages shareable link. Use after local HTML demos are debugged (e.g., via html-demo-generator) and the user explicitly wants an online URL.
---

# Push to GitHub (visbody-demo)

## Instructions

当用户已经在本地完成 Demo 的多轮调试，并明确表示「现在要推到 GitHub / 生成线上可分享链接」时，按下面规则执行。

> 重要：本 Skill 不负责生成或修改 Demo 的业务内容，只负责 **git add/commit/push + 输出 GitHub Pages 链接**。  
> 若需要先生成或更新 Demo，请使用 `html-demo-generator` 等 Skill 完成本地文件与本地预览。

### 使用前准备

1. **确认仓库根目录**  
   - 默认假设工作目录根为 `visbody-demo` 仓库（含 `.git`）。  
   - 若当前工作区外层还有一层目录（例如 `/Users/kean/Desktop/cursor/visbody-demo/`），则所有 git 命令都在该子目录下执行。  
2. **确认远程 remote**  
   - 期望远程为：`git@github.com:dan951781659/visbody-demo.git`。  
   - 若当前 remote 不是该地址，可执行：  
     - `git remote set-url origin git@github.com:dan951781659/visbody-demo.git`

### 必做流程

1. **选择需要推送的文件**  
   - 根据当前对话上下文，识别本次改动涉及的 Demo 路径，例如：  
     - 入口页：`index.html`  
     - 报告导出 Demo：`report-export/index.html`  
     - 其他 Demo：如 `login-auth/index.html`、`device-pro-renew/index.html` 等  
   - 用 `git add` 只添加本次相关文件，避免无关文件混入提交。  
2. **提交**  
   - 运行：`git commit -m "demo: <简短中文摘要>"`  
   - 提交信息建议包含本次改动的 Demo 槽位，例如：`demo: 更新 report-export 授权交互`。  
   - 如无文件变化（git 提示 nothing to commit），说明已经是最新，不需要重复提交，可直接进入第 3 步推送/检查。  
3. **推送到远程**  
   - 运行：`git push origin main`  
   - 若因远程有新提交而推送失败：  
     - 先执行：`git pull origin main --rebase`  
     - 冲突解决后重新 `git push origin main`。  
4. **输出线上链接**  
   - 根入口页链接：`https://dan951781659.github.io/visbody-demo/`  
   - 常见子路径示例（按实际存在的文件返回）：  
     - 报告导出 Demo：`https://dan951781659.github.io/visbody-demo/report-export/`  
     - 登录授权 Demo：`https://dan951781659.github.io/visbody-demo/login-auth/`  
     - 设备续费 / 会员页：`https://dan951781659.github.io/visbody-demo/device-pro-renew/`  
   - 在回复中**明确列出**本次改动涉及的线上 URL，方便用户直接点击验证与分享。

### GitHub Pages 状态检查（如有必要）

如果用户反馈「链接打不开」或这是首次部署，应提醒用户在 GitHub 上确认 Pages 设置：

1. 打开仓库：`https://github.com/dan951781659/visbody-demo`  
2. 进入：**Settings → Pages**  
3. 在 **Build and deployment → Source** 中选择：  
   - Source：`Deploy from a branch`  
   - Branch：`main`  
   - Folder：`/ (root)`  
4. 保存后等待 1–2 分钟，GitHub 完成构建后，再访问上述 Pages 链接。

## Examples

- 用户说：「报告导出 Demo 在本地已经 OK 了，帮我推到 GitHub 并给我线上地址。」  
  - 行为：  
    - 在 `visbody-demo/` 仓库内，`git add report-export/index.html`；  
    - `git commit -m "demo: 更新 report-export 报告导出授权交互"`；  
    - `git push origin main`；  
    - 在回复中给出：  
      - `https://dan951781659.github.io/visbody-demo/`  
      - `https://dan951781659.github.io/visbody-demo/report-export/`（并说明这是本次更新的 Demo）。

