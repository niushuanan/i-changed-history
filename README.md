# 哎！我改变了历史？

一款由 DeepSeek 实时驱动的移动端架空历史游戏。玩家从 50 个真实历史瞬间进入同一主角的一生，完成 12 次决定，并看到世界如何一路变化到 2026 年。

## 本地运行

需要安装以下环境：

- Node.js 20、22 或 24 及以上版本
- npm 10 及以上版本
- 一个可用的 DeepSeek API Key

### macOS / Linux

```bash
git clone https://github.com/niushuanan/i-changed-history.git
cd i-changed-history
npm ci
cp .env.example .env.local
```

打开 `.env.local`，填写：

```dotenv
VITE_DEEPSEEK_API_KEY=你的_API_Key
```

然后启动：

```bash
npm run dev
```

### Windows PowerShell

```powershell
git clone https://github.com/niushuanan/i-changed-history.git
Set-Location i-changed-history
npm ci
Copy-Item .env.example .env.local
```

打开 `.env.local`，填写 `VITE_DEEPSEEK_API_KEY` 后运行：

```powershell
npm run dev
```

终端会显示本地访问地址，通常是 `http://localhost:5173/`。

## 验证命令

```bash
npm run check:portability
npm test
npm run typecheck
npm run build
```

`check:portability` 会阻止个人电脑的绝对用户路径进入安装、构建和运行配置。GitHub Actions 会在 Windows 与 Linux 上分别执行完整安装、测试和构建。

## 密钥说明

`.env.local` 已被 Git 忽略，不会上传到仓库。当前项目是纯前端本地比赛原型，浏览器会直接调用 DeepSeek；请只使用个人测试 Key，不要将该方案直接用于公开生产部署。
