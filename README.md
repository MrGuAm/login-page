# Champion 登录页

这是一个为 Champion's Blog 准备的动画登录页。页面使用简洁的密码表单，搭配会跟随鼠标和输入状态变化的角色动画，并支持浅色/深色模式。

## 功能特点

- 角色动画会响应鼠标移动和密码输入
- 支持浅色模式和深色模式
- 使用密码完成登录
- 通过 cookie 保存已登录状态
- 适配桌面端和移动端
- 基于 Next.js、React、Tailwind CSS、Base UI、shadcn/ui 和 lucide-react 构建

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Base UI
- shadcn/ui
- lucide-react

## 本地运行

安装依赖：

```bash
npm install
```

创建本地环境变量文件 `.env.local`：

```bash
NEXT_PUBLIC_PASSWORD=your-password
```

启动开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 可用脚本

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 登录流程

登录表单会将输入的密码与 `NEXT_PUBLIC_PASSWORD` 进行比较。密码正确时，应用会写入 `authenticated=true` cookie，并跳转到 `/write`。

## 项目结构

```text
src/app/layout.tsx       应用元信息和全局布局
src/app/page.tsx         动画登录页面
src/app/globals.css      Tailwind 主题和全局样式
src/components/ui        可复用 UI 组件
src/lib/utils.ts         工具函数
```

## 部署

项目可以部署到 Vercel 或任何支持 Next.js 的平台。发布前请在部署平台中配置 `NEXT_PUBLIC_PASSWORD` 环境变量。
