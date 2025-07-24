---
// Rust服务端逻辑示例
use rsx::{Request, Response, Promise};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

async fn get_server_side_props(req: Request) -> Response {
    let user_id = req.query("id").parse::<u32>().unwrap_or(0);

    match fetch_user(user_id).await {
        Ok(user) => {
            Response::json!({
                "code": 0,
                "data": {
                    "user": user,
                    "timestamp": chrono::Utc::now().timestamp()
                },
                "message": "success"
            })
        }
        Err(err) => {
            Response::json!({
                "code": -1,
                "data": null,
                "message": format!("Error: {}", err)
            })
        }
    }
}

async fn fetch_user(id: u32) -> Result<User, Box<dyn std::error::Error>> {
    // 模拟数据库查询
    Ok(User {
        id,
        name: format!("User {}", id),
        email: format!("user{}@example.com", id),
    })
}
---

<script>
// TypeScript客户端逻辑
import { defineProps, ref, computed } from 'rsx';
import type { User } from './types';

// 组件属性接口
interface Props {
    user: User;
    timestamp: number;
    theme?: 'dark' | 'light';
}

// 定义组件属性
const props = defineProps<Props>({
    theme: 'light'
});

// 响应式数据
const isEditing = ref(false);
const editForm = ref({
    name: props.user.name,
    email: props.user.email
});

// 计算属性
const formattedDate = computed(() => {
    return new Date(props.timestamp * 1000).toLocaleString();
});

// 方法
function toggleEdit() {
    isEditing.value = !isEditing.value;
}

function saveUser() {
    // 保存用户逻辑
    console.log('Saving user:', editForm.value);
    isEditing.value = false;
}

// 导出组件配置
export default {
    components: [],
    methods: {
        toggleEdit,
        saveUser
    }
}
</script>

<template>
    <div class="user-profile {{ props.theme }}">
        <header class="profile-header">
            <h1>用户资料</h1>
            <p class="last-updated">最后更新: {{ formattedDate }}</p>
        </header>

        {{#if !isEditing}}
            <div class="user-info">
                <div class="info-item">
                    <label>用户ID:</label>
                    <span>{{ props.user.id }}</span>
                </div>
                <div class="info-item">
                    <label>姓名:</label>
                    <span>{{ props.user.name }}</span>
                </div>
                <div class="info-item">
                    <label>邮箱:</label>
                    <span>{{ props.user.email }}</span>
                </div>
            </div>
        {{:else}}
            <form class="edit-form">
                <div class="form-group">
                    <label for="name">姓名:</label>
                    <input
                        type="text"
                        id="name"
                        value="{{ editForm.name }}"
                    />
                </div>
                <div class="form-group">
                    <label for="email">邮箱:</label>
                    <input
                        type="email"
                        id="email"
                        value="{{ editForm.email }}"
                    />
                </div>
                <div class="form-actions">
                </div>
            </form>
        {{/if}}

        {{#if props.user.id > 0}}
            <div class="user-stats">
                <h3>用户统计</h3>
                {{#each stats as stat}}
                    <div class="stat-item">
                        <span class="stat-label">{{ stat.label }}:</span>
                        <span class="stat-value">{{ stat.value }}</span>
                    </div>
                {{/each}}
            </div>
        {{:else}}
            <div class="no-user">
                <p>未找到用户信息</p>
            </div>
        {{/if}}

        <div class="raw-content">
            {{@html props.user.bio || '<p>暂无个人简介</p>'}}
        </div>
    </div>
</template>

<style>
.user-profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    &.dark {
        background-color: #1e1e1e;
        color: #ffffff;
    }

    &.light {
        background-color: #ffffff;
        color: #333333;
    }

    .profile-header {
        margin-bottom: 30px;
        text-align: center;

        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #007acc;
        }

        .last-updated {
            color: #666;
            font-size: 0.9rem;
        }
    }

    .user-info {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;

        .info-item {
            display: flex;
            margin-bottom: 15px;

            label {
                font-weight: bold;
                width: 100px;
                color: #555;
            }

            span {
                flex: 1;
            }
        }

        .edit-btn {
            background: #007acc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background: #005a9e;
            }
        }
    }

    .edit-form {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;

        .form-group {
            margin-bottom: 20px;

            label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
                color: #555;
            }

            input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;

                &:focus {
                    outline: none;
                    border-color: #007acc;
                    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
                }
            }
        }

        .form-actions {
            display: flex;
            gap: 10px;

            button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
            }

            .save-btn {
                background: #28a745;
                color: white;

                &:hover {
                    background: #218838;
                }
            }

            .cancel-btn {
                background: #6c757d;
                color: white;

                &:hover {
                    background: #5a6268;
                }
            }
        }
    }

    .user-stats {
        background: #e9ecef;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;

        h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #495057;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .stat-label {
                font-weight: 500;
            }

            .stat-value {
                font-weight: bold;
                color: #007acc;
            }
        }
    }

    .no-user {
        text-align: center;
        padding: 40px;
        color: #999;
    }

    .raw-content {
        border-top: 1px solid #dee2e6;
        padding-top: 20px;
        margin-top: 20px;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-profile {
        padding: 15px;

        .profile-header h1 {
            font-size: 2rem;
        }

        .user-info .info-item {
            flex-direction: column;

            label {
                width: auto;
                margin-bottom: 5px;
            }
        }

        .edit-form .form-actions {
            flex-direction: column;

            button {
                width: 100%;
            }
        }
    }
}
</style>
