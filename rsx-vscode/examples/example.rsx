---
use serde::{Deserialize, Serialize};
use actix_web::{web, HttpRequest, HttpResponse, Result};

#[derive(Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn get_server_side_props(req: HttpRequest) -> Result<HttpResponse> {
    let users = vec![
        User {
            id: 1,
            name: "张三".to_string(),
            email: "zhangsan@example.com".to_string(),
        },
        User {
            id: 2,
            name: "李四".to_string(),
            email: "lisi@example.com".to_string(),
        },
    ];

    Ok(HttpResponse::Ok().json(users))
}
---

<script>
interface UserProps {
    users: User[];
    loading: boolean;
    error?: string;
}

const { users, loading, error } = defineProps<UserProps>();

const isActive = (userId: number) => {
    return userId === 1;
};
</script>

<template>
    <div class="user-container">
        <h1>用户列表</h1>

        {#if loading}
            <div class="loading">加载中...</div>
        {:else if error}
            <div class="error">错误: {{ error }}</div>
        {:else}
            <ul class="user-list">
                {#each users as user, index}
                    <li class="user-item {{ isActive(user.id) ? 'active' : 'inactive' }}"
                        data-index="{{ index }}">
                        <div class="user-info">
                            <h3>{{ user.name }}</h3>
                            <p>{{ user.email }}</p>
                        </div>
                        <button>
                            查看详情
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}

        <!-- 原始HTML输出示例 -->
        <div class="raw-content">
            {{@html rawHtmlContent}}
        </div>

        <!-- 客户端组件示例 -->
        <UserProfile client="react" user="{{ selectedUser }}" />
        <UserChart client="vue" data="{{ chartData }}" />
    </div>
</template>

<style>
.user-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

    h1 {
        color: #333;
        text-align: center;
        margin-bottom: 30px;
    }
}

.loading, .error {
    text-align: center;
    padding: 20px;
    border-radius: 4px;
    margin: 20px 0;
}

.loading {
    background-color: #e3f2fd;
    color: #1976d2;
}

.error {
    background-color: #ffebee;
    color: #d32f2f;
}

.user-list {
    list-style: none;
    padding: 0;

    .user-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        transition: all 0.3s ease;

        &.active {
            background-color: #f5f5f5;
            border-color: #2196f3;
        }

        &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .user-info {
            h3 {
                margin: 0 0 5px 0;
                color: #333;
            }

            p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }
        }

        button {
            background-color: #2196f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: #1976d2;
            }
        }
    }
}

.raw-content {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
}
</style>
