# RSX VS Code扩展使用指南

## 安装

1. 下载 `rsx-vscode-0.1.0.vsix` 文件
2. 在VS Code中按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的 `.vsix` 文件进行安装

## 功能特性

### 1. 语法高亮

RSX扩展为以下四个部分提供完整的语法高亮支持：

- **Rust部分** (`---` 分隔符内)：完整的Rust语法高亮
- **Script部分** (`<script>` 标签内)：TypeScript/JavaScript语法高亮
- **Template部分** (`<template>` 标签内)：Handlebars模板语法高亮
- **Style部分** (`<style>` 标签内)：SCSS语法高亮

### 2. 代码片段 (Snippets)

扩展提供了丰富的代码片段，帮助快速编写RSX代码：

#### 基础模板

- `rsx` - 创建完整的RSX文件模板

#### Rust部分

- `fn` - 创建异步函数
- `use` - Rust use语句
- `response` - JSON响应模板

#### Template部分

- `if` - 条件渲染块
- `ifelse` - 带else的条件渲染块
- `each` - 列表渲染块
- `eachi` - 带索引的列表渲染块
- `await` - 异步渲染块
- `var` - 变量插值
- `html` - HTML内容输出
- `client` - 客户端组件

#### Script部分

- `props` - 组件属性接口
- `import` - 导入语句

#### Style部分

- `nested` - SCSS嵌套规则

### 3. 智能补全

#### Handlebars表达式补全

输入 `{{` 后会自动提示：

- 变量插值
- HTML内容输出

#### Svelte块补全

输入 `{#` 后会自动提示：

- if条件块
- each循环块
- await异步块

### 4. 文档符号

大纲视图会显示文件的四个主要部分：

- Rust Section
- Script Section
- Template Section
- Style Section

### 5. 格式化

支持文档格式化功能，会根据不同部分应用相应的格式化规则。

### 6. 命令

可通过命令面板执行以下命令：

- `RSX: Hello World` - 显示欢迎信息
- `RSX: New RSX File` - 创建新的RSX文件
- `RSX: Format Document` - 格式化当前文档

## RSX文件结构

```rsx
---
// Rust部分：服务端逻辑
use rsx::{Request, Response};

async fn get_server_side_props(req: Request) -> Response {
    Response::json!({
        "code": 0,
        "data": {},
    })
}
---

<script>
// JavaScript/TypeScript部分
import { defineProps } from 'rsx';

interface Props {
    // 定义组件属性
}

const props = defineProps<Props>({});

export default {
    components: [],
}
</script>

<template>
    <!-- Template部分：handlebars模板 -->
    <div>
        <h1>{{ title }}</h1>
        {#if condition}
            <p>条件内容</p>
        {/if}
        {#each items as item}
            <span>{{ item.name }}</span>
        {/each}
    </div>
</template>

<style>
/* Style部分：SCSS样式 */
div {
    padding: 20px;

    h1 {
        color: #333;
        font-size: 24px;
    }
}
</style>
```

## 语法规则

### Template部分语法

#### 变量插值

```html
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
```

#### 条件渲染

```html
{#if condition}
<p>条件为真时显示</p>
{:else if another}
<p>另一个条件</p>
{:else}
<p>默认内容</p>
{/if}
```

#### 列表渲染

```html
{#each items as item, index}
<div>{{ index }}: {{ item.name }}</div>
{/each}
```

#### HTML输出

```html
{{@html htmlContent}}
```

#### 客户端组件

```html
<MyComponent client="react" data="{{data}}"></MyComponent>
<VueApp client="vue" props="{{props}}"></VueApp>
<SvelteWidget client="svelte" config="{{config}}"></SvelteWidget>
```

### Rust部分语法

```rust
use rsx::{Request, Response, Promise};

async fn get_server_side_props(req: Request) -> Response {
    // 服务端逻辑
    Response::json!({
        "code": 0,
        "data": {},
        "message": "success"
    })
}
```

### Script部分语法

```typescript
import { defineProps, ref, computed } from 'rsx'

interface Props {
    title: string
    items: Array<any>
}

const props = defineProps<Props>({})
const count = ref(0)

const doubleCount = computed(() => count.value * 2)

export default {
    components: []
}
```

### Style部分语法

```scss
.container {
    max-width: 1200px;
    margin: 0 auto;

    .header {
        background: #f5f5f5;

        &:hover {
            background: #e0e0e0;
        }
    }

    @media (max-width: 768px) {
        padding: 10px;
    }
}
```

## 自动补全功能

1. **变量补全**：在模板中输入`{{`时会提示可用变量
2. **块补全**：输入`{#`时会提示控制流块
3. **属性补全**：在组件标签中会提示可用属性
4. **CSS补全**：在样式部分提供SCSS语法补全

## 快捷键

- `Ctrl+Space` - 触发智能补全
- `Alt+Shift+F` - 格式化文档
- `Ctrl+Shift+P` - 打开命令面板

## 故障排除

### 语法高亮不工作

1. 确保文件扩展名为 `.rsx`
2. 重启VS Code
3. 检查文件关联设置

### 智能补全不显示

1. 确保语言服务器正在运行
2. 检查VS Code输出面板中的错误信息
3. 重新加载窗口

### 格式化问题

1. 检查文件语法是否正确
2. 确保各部分标签正确闭合
3. 使用命令面板中的"RSX: Format Document"命令

## 更新日志

### v0.1.0

- 初始版本发布
- 完整的语法高亮支持
- 代码片段支持
- 智能补全功能
- 文档格式化
- 文档符号支持

## 反馈和贡献

如果您发现任何问题或有改进建议，请在项目仓库中提交issue或pull request。

项目地址：https://github.com/guobin211/rsx-vscode
