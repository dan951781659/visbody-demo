# 部署到 GitHub 并获取可分享链接

按下面步骤操作即可把本 Demo 部署到 GitHub Pages，并得到可分享的链接。

---

## 第一步：在 GitHub 上新建仓库

1. 打开 **https://github.com/new**
2. **Repository name** 填：`visbody-demo`（或你喜欢的英文名）
3. 选择 **Public**
4. **不要**勾选 “Add a README file”
5. 点击 **Create repository**

---

## 第二步：把本地代码推送到 GitHub

在终端里进入本目录后，按你的 **GitHub 用户名** 替换下面命令里的 `你的用户名`，再依次执行：

```bash
cd "c:\Users\95178\Desktop\cursor\PMokr\visbody-demo"

git remote add origin https://github.com/你的用户名/visbody-demo.git
git branch -M main
git push -u origin main
```

（若仓库名不是 `visbody-demo`，请把上面地址里的仓库名也改成你的仓库名。）

推送时按提示登录 GitHub 或使用 Personal Access Token。

---

## 第三步：开启 GitHub Pages

1. 打开你的仓库页面，例如：`https://github.com/你的用户名/visbody-demo`
2. 点击 **Settings**（设置）
3. 左侧找到 **Pages**
4. **Source** 选 **Deploy from a branch**
5. **Branch** 选 **main**，文件夹选 **/ (root)**，点 **Save**
6. 等 1～2 分钟，页面会显示绿色提示和你的站点地址

---

## 可分享链接

部署成功后，可分享的链接格式为：

**https://你的用户名.github.io/visbody-demo/**

例如用户名为 `zhangsan`、仓库名为 `visbody-demo` 时，链接为：

**https://zhangsan.github.io/visbody-demo/**

把该链接发给别人即可直接打开 Demo 页面。

---

## 遇到 404 “There isn't a GitHub Pages site here” 时

按下面逐项检查：

### 1. 链接是否带仓库名（最常见）

- **错误**：访问 `https://你的用户名.github.io`（没有仓库名）
- **正确**：访问 `https://你的用户名.github.io/visbody-demo/`（末尾的 `/` 可加可不加）

项目页必须带仓库名，例如：`https://你的用户名.github.io/visbody-demo/`。

### 2. 是否已开启 GitHub Pages

1. 打开仓库 → **Settings** → 左侧 **Pages**
2. **Build and deployment** 下：
   - **Source** 选 **Deploy from a branch**
   - **Branch** 选 **main**（不是 master）
   - **Folder** 选 **/ (root)** → 点 **Save**
3. 保存后等 1～2 分钟再访问

### 3. 分支和文件是否一致

- 代码必须在 **main** 分支（若你用的是 master，在 Pages 里就选 master）
- 仓库根目录下要有 **index.html**（本仓库已满足）

### 4. 仓库是否为 Public

- GitHub 免费版只对 **Public** 仓库提供 Pages，请确认仓库是公开的。

### 5. 仍不行时

- 到仓库 **Settings → Pages** 看是否出现绿色提示 “Your site is live at …”，用那里给的链接打开。
- 若刚推送或刚改设置，可再等几分钟后刷新。
