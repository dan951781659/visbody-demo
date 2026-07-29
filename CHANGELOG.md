# 变更日志

本文件记录 MotionStation 移动端原型的版本变更，便于与研发同步。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### 新增

- （待发布改动写在这里）

### 变更

- 

### 修复

- 

---

## [1.0.0] - 2026-07-29

### 新增

- 初始原型交付：Expo Router 四栏 Tab（首页 / 探索 / 训练 / 我的）
- 登录注册、训练计划、设备连接、内容详情等核心页面
- 设计令牌（`src/theme`）与 Mock 数据（`src/data`）

### 说明

- 首次交付研发，Tag：`v1.0.0-handoff`
- 本地启动：`npm install && npm start`
- Web 快照：`npm run export:web`

---

## 同步研发 checklist

每次发布新版本时，按顺序完成：

1. [ ] 在本文件 `[Unreleased]` 中整理变更，并发布为新版本号区块
2. [ ] `git add . && git commit -m "..." && git push`
3. [ ] `git tag -a vX.Y.Z -m "简要说明" && git push origin vX.Y.Z`
4. [ ] （可选）`npm run export:web`，部署 `dist-web/` 并附预览链接
5. [ ] 通知研发：版本号、Tag、主要变更、影响文件、预览地址

### 变更说明模板（可复制到 IM / 邮件）

```markdown
## vX.Y.Z（YYYY-MM-DD）

### 变更
- 

### 影响文件
- 

### 预览
- Tag：vX.Y.Z
- Web 快照：（链接，如有）
```
