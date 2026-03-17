# 部署到 GitHub Pages 并获取分享链接

## 方式一：部署到已有仓库（推荐）

**不需要新建仓库**。把本演示当作已有仓库里的一个**子目录**，推送即可，**不会影响**该仓库里已部署的其它页面。

### 1. 把本演示放进已有仓库

在你**已经用于 GitHub Pages 的仓库**本地目录中，新建一个子文件夹，例如：

- **英文名**（推荐，链接更简洁）：`desktop-shortcut-demo`
- 或直接用中文名：`桌面快捷方式-演示`

把当前「桌面快捷方式-演示」里的**全部文件**复制进去，保证子目录结构类似：

```
你的已有仓库/
├── index.html          ← 你原来的首页，不动
├── 其他已有文件/       ← 都不动
└── desktop-shortcut-demo/   ← 新建子目录，把本演示的文件都放这里
    ├── index.html
    ├── manifest.json
    ├── sw.js
    ├── 桌面快捷方式-移动端演示.html
    ├── 桌面快捷方式-产品需求文档.md
    ├── README.md
    └── DEPLOY.md
```

### 2. 提交并推送

在**仓库根目录**下执行（不是进到子目录）：

```powershell
git add desktop-shortcut-demo
git commit -m "新增：桌面快捷方式演示"
git push
```

（若子目录名是 `桌面快捷方式-演示`，则 `git add 桌面快捷方式-演示`。）

### 3. 分享链接（不影响原有内容）

- 你**原来的页面**地址不变，例如：  
  `https://你的用户名.github.io/仓库名/`
- **本演示**的地址为：在原有地址后加上子目录名 + `/`：

**https://你的用户名.github.io/仓库名/子目录名/**

例如：
- 子目录为 `desktop-shortcut-demo` →  
  **https://zhangsan.github.io/PMokr/desktop-shortcut-demo/**
- 子目录为 `桌面快捷方式-演示` →  
  **https://zhangsan.github.io/PMokr/桌面快捷方式-演示/**

无需改 GitHub Pages 设置，推送后约 1～2 分钟即可访问。

---

## 方式二：部署到新仓库（单独一个仓库）

若希望本演示**单独一个仓库**、根路径就是演示页，再使用此方式。

### 1. 在 GitHub 上新建仓库

- 打开 [GitHub New repository](https://github.com/new)。
- **Repository name** 填英文名，如 `desktop-shortcut-demo`。
- **Public**，可不勾选「Add a README」。
- 创建后记下仓库地址。

### 2. 在「桌面快捷方式-演示」目录下初始化并推送

在**本演示所在目录**打开终端，执行（把 `你的用户名`、`仓库名` 换成实际值）：

```powershell
git init
git add .
git commit -m "桌面快捷方式演示"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 3. 开启 GitHub Pages

- 仓库 → **Settings** → **Pages**。
- **Source**：Deploy from a branch。
- **Branch**：main，**Folder**：/ (root)，保存。

### 4. 分享链接

**https://你的用户名.github.io/仓库名/**

例如：**https://zhangsan.github.io/desktop-shortcut-demo/**

---

## 小结

| 方式     | 是否新建仓库 | 原有内容是否受影响 | 本演示的访问地址 |
|----------|--------------|--------------------|------------------|
| 已有仓库 | 否           | 不受影响           | `原站点地址/子目录名/` |
| 新仓库   | 是           | 不涉及             | `用户名.github.io/新仓库名/` |

**推荐**：多个演示页都放在同一个仓库的不同子目录里，只维护一个仓库，每个页面有独立链接。
