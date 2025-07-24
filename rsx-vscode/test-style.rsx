---
// Rust服务端代码
use serde::Serialize;

#[derive(Serialize)]
struct StyleData {
    theme: String,
    colors: Vec<String>,
}

async fn get_server_side_props() -> StyleData {
    StyleData {
        theme: "dark".to_string(),
        colors: vec!["#333".to_string(), "#666".to_string()],
    }
}
---

<script>
// TypeScript客户端代码
interface ThemeProps {
    theme: string;
    colors: string[];
}

const { theme, colors } = defineProps<ThemeProps>();

const toggleTheme = () => {
    console.log(`切换主题: ${theme}`);
};
</script>

<template>
    <div class="theme-container">
        <h1>主题测试</h1>
        <button class="theme-toggle">切换主题</button>

        {#each colors as color}
            <div class="color-box" style="background-color: {{ color }}"></div>
        {/each}
    </div>
</template>

<style>
// SCSS样式测试
$primary-color: #007bff;
$secondary-color: #6c757d;
$border-radius: 4px;
$transition-duration: 0.3s;

// 混合宏
@mixin button-style($bg-color, $text-color: white) {
    background-color: $bg-color;
    color: $text-color;
    border: none;
    padding: 10px 20px;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:hover {
        opacity: 0.8;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
}

// 嵌套样式
.theme-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;

    h1 {
        color: $primary-color;
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5rem;

        &::after {
            content: '';
            display: block;
            width: 50px;
            height: 3px;
            background-color: $secondary-color;
            margin: 10px auto;
        }
    }

    button {
        @include button-style($primary-color);
        display: block;
        margin: 20px auto;
        font-size: 1.1rem;

        &.secondary {
            @include button-style($secondary-color);
        }
    }

    .color-box {
        width: 100px;
        height: 100px;
        display: inline-block;
        margin: 10px;
        border-radius: $border-radius;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform $transition-duration ease;

        &:hover {
            transform: scale(1.1);
        }

        // 响应式设计
        @media (max-width: 768px) {
            width: 80px;
            height: 80px;
            margin: 5px;
        }

        @media (max-width: 480px) {
            width: 60px;
            height: 60px;
        }
    }
}

// 深色主题
.theme-container.dark {
    background-color: #1a1a1a;
    color: #ffffff;

    h1 {
        color: #ffffff;
    }

    button {
        @include button-style(#333333, #ffffff);
    }
}

// 动画关键帧
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 应用动画
.theme-container {
    animation: fadeIn 0.6s ease-out;
}

// 伪元素样式
.color-box {
    position: relative;

    &::before {
        content: attr(data-color);
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: $secondary-color;
    }
}

// 函数使用
@function calculate-rem($px) {
    @return #{$px / 16}rem;
}

.responsive-text {
    font-size: calculate-rem(18);
    line-height: calculate-rem(24);
}
</style>
