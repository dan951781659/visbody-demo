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
