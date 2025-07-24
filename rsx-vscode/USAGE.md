# RSX VSCode 插件使用指南

## 概述

RSX VSCode插件为RSX语言提供了完整的语法高亮支持，包括：

- Rust服务端代码高亮
- TypeScript/JavaScript客户端代码高亮
- Handlebars模板语法高亮
- SCSS样式代码高亮
- 智能代码折叠和自动补全

## 功能特性

### 1. 语法高亮

插件支持RSX文件的四个主要部分：

#### Rust部分 (服务端逻辑)
```rsx
---
async fn get_server_side_props(req: Request) -> Response {
    let data = fetch_data().await;
    Response::json!({ "data": data })
}
---
```

#### Script部分 (客户端逻辑)
```rsx
<script>
const { users, loading } = defineProps<{
    users: User[];
    loading: boolean;
}>();
</script>
```

#### Template部分 (Handlebars模板)
```rsx
<template>
    {#if loading}
        <div>加载中...</div>
    {:else}
        {#each users as user}
            <div>{{ user.name }}</div>
        {/each}
    {/if}
</template>
```

#### Style部分 (SCSS样式)
```rsx
<style>
.container {
    max-width: 800px;

    .item {
        padding: 10px;

        &:hover {
            background-color: #f5f5f5;
        }
    }
}
</style>
```

### 2. 智能特性

- **代码折叠**: 支持各个代码块的折叠
- **自动补全**: 支持标签和括号的自动闭合
- **语法验证**: 实时语法错误检测
- **格式化**: 代码自动格式化

### 3. 客户端组件支持

插件识别并高亮客户端组件标签：

```rsx
<template>
    <ReactComponent client="react" data="{{ data }}" />
    <VueComponent client="vue" props="{{ props }}" />
    <SvelteComponent client="svelte" state="{{ state }}" />
</template>
```

## 安装方法

### 方法1: 从VSIX文件安装

1. 构建插件包：
```bash
cd rsx-vscode
npm run build
npm run release
```

2. 在VSCode中安装：
   - 打开VSCode
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
   - 输入 "Extensions: Install from VSIX..."
   - 选择生成的 `.vsix` 文件

### 方法2: 开发模式

1. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd rsx-vscode
npm install
```

2. 在VSCode中打开项目

3. 按 `F5` 启动调试模式

## 配置选项

在VSCode设置中可以配置以下选项：

```json
{
    "rsx.enableSyntaxHighlighting": true,
    "rsx.enableAutoCompletion": true,
    "rsx.enableCodeFolding": true
}
```

## 文件关联

插件自动关联 `.rsx` 文件扩展名，无需手动配置。

## 故障排除

### 语法高亮不工作

1. 确保文件扩展名为 `.rsx`
2. 重启VSCode
3. 检查插件是否正确安装和启用

### 代码补全不工作

1. 确保TypeScript服务正在运行
2. 检查项目中是否有 `tsconfig.json` 文件
3. 重新加载窗口 (`Ctrl+Shift+P` -> "Developer: Reload Window")

## 示例文件

查看 `examples/example.rsx` 文件了解完整的RSX语法示例。

## 贡献

欢迎提交Issue和Pull Request来改进这个插件。

## 许可证

MIT License
