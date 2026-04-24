# Champion 登录页

一个带角色动效的单页登录界面，基于 Next.js 16、React 19 和 Tailwind CSS 4 构建。

这个项目目前专注做一件事：在当前页面内完成密码验证和登录状态展示，不跳转路由，不写入 cookie，也不引入额外后端服务。

## 当前特性

- 四个角色会跟随鼠标移动，并在输入密码、查看密码时做出不同反馈
- 支持浅色和深色模式切换
- 登录区域已适配桌面端和移动端
- 底部装饰元素在桌面端和移动端都会显示
- 密码校验走服务端接口，环境变量只使用 `Pwd`

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Base UI
- shadcn/ui
- lucide-react

## 快速开始

1. 安装依赖

```bash
npm install
```

2. 新建 `.env.local`

```bash
Pwd=your-password
```

3. 启动开发环境

```bash
npm run dev
```

4. 打开浏览器访问

```text
http://localhost:3000
```

## 环境变量

项目只读取一个密码环境变量：

```bash
Pwd=your-password
```

说明：

- `Pwd` 只在服务端读取
- 前端提交密码到 `/api/login`
- 如果没有配置 `Pwd`，页面会提示“请先配置 Pwd。”

## 登录流程

1. 用户在首页输入密码并提交
2. 前端将密码发送到 `POST /api/login`
3. 服务端读取 `process.env.Pwd` 进行比对
4. 密码正确时在当前页面显示登录成功状态
5. 退出登录只清理当前页面状态

## 可用脚本

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 项目结构

```text
src/app/layout.tsx           全局布局与页面元信息
src/app/page.tsx             登录页 UI、角色动画与交互逻辑
src/app/api/login/route.ts   服务端密码校验接口
src/app/globals.css          全局样式与主题变量
src/components/ui            基础 UI 组件
src/lib/utils.ts             通用工具函数
```

## 部署说明

可以部署到 Vercel 或其他支持 Next.js 的平台。

部署前请确认：

- 已配置环境变量 `Pwd`
- 目标平台允许 Next.js App Router 的服务端路由运行

## 校验命令

提交前建议运行：

```bash
npm run lint
npm run build
```
