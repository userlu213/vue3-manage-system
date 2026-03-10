# BMS (Backend Management System) 后台管理系统

## 项目简介

BMS是一个基于Vue 3 + Element Plus的后台管理系统前端项目，主要用于用户管理、权限控制、数据监控等功能。

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP请求**: Axios
- **构建工具**: Vite
- **样式预处理器**: Less

## 项目结构

```
src/
├── api/                    # API接口
├── assets/                 # 静态资源
├── components/             # 公共组件
├── config/                 # 配置文件
├── router/                 # 路由配置
├── stores/                 # 状态管理
├── utils/                  # 工具函数
├── views/                  # 页面组件
└── App.vue                 # 根组件
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 功能模块

### 1. 用户管理模块

- 用户列表展示
- 新增/编辑用户
- 批量操作功能
- 删除撤销功能
- 回收站管理

### 2. 权限管理

- 基于角色的权限控制
- 动态路由生成
- 菜单权限管理

### 3. 全局功能

- 响应式布局
- 路由守卫
- 错误处理

## 登录账号

### 管理员账号

- **用户名**: admin
- **密码**: 123456

### 普通用户账号

- **用户名**: user
- **密码**: 123456

## 核心功能说明

### 批量操作功能

用户管理模块支持批量操作：

- 批量删除
- 跨页选择
- 操作撤销

### 回收站功能

- 软删除用户数据
- 数据恢复功能
- 永久删除选项
- 清空回收站

## 开发规范

### 代码规范

- 使用ESLint + Prettier进行代码格式化
- 遵循Vue 3 Composition API规范
- 组件命名采用PascalCase
- 文件命名采用kebab-case

### API规范

- 统一使用RESTful API风格
- 错误处理统一封装
- 请求拦截器自动处理loading

### 组件规范

- 组件职责单一
- Props类型明确定义
- 事件命名规范

## 部署说明

### 开发环境

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 开发计划

### 已完成功能

- ✅ 用户管理模块
- ✅ 权限控制系统
- ✅ 响应式布局
- ✅ 批量操作功能
- ✅ 回收站功能

## 常见问题

### Q: 如何添加新的页面？

A: 在`src/views/`目录下创建新的Vue组件，然后在`src/router/index.js`中添加路由配置。

### Q: 如何添加API接口？

A: 在`src/api/`目录下创建对应的API文件，使用统一的request工具发送请求。

## 许可证

本项目采用 MIT 许可证。

---

