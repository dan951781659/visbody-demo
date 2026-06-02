# WellnessHub 多角色运营指标 React Demo

这套代码是按当前版本运营分析范围拆出的 React 演示骨架，目标是方便研发直接接入现有 WellnessHub Web 后台。

## 结构

- `src/App.jsx`: 全局状态、角色切换、套餐切换、页面切换
- `src/components/`: 通用后台组件
- `src/config/roles.js`: 角色、页面、筛选项配置
- `src/mock/data.js`: mock 数据和默认选中态
- `src/pages/rolePages.jsx`: 9 个页面视图
- `src/styles.css`: 样式 token 和布局规则

## 运行

```bash
npm install
npm run dev
```

## 交付说明

- 采用 WellnessHub 标准后台模式，不使用训练大纲特例模式。
- 复用 `AppShell`、`FilterBar`、`StatStrip`、`DataTable`、`DetailPanel`。
- 已覆盖 `loading / empty / disabled` 三种状态。
- 当前版本只保留运营分析页，不包含单独的 AI 助手分析模块。
- 非 Pro 与 Pro 的差异通过指标显隐和锁定态处理，而不是通过页面入口屏蔽。
