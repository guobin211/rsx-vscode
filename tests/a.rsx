---
use rsx::{ Request, Response };

async fn get_server_props(request: Request) -> Response {
    Response::json!({
        "title": "rsx project",
        "pageName": "index.html"
    })
}
---

<script>
    import ServerComponent from './b.rsx';
    import ClientComponent from './c.tsx';
    const { pageName, title } = $props;
</script>

<template>
    <div>
        <h1 class="title">welcome to {pageName}</h1>
        <ServerComponent title={title}></ServerComponent>
        <ClientComponent title={title}></ClientComponent>
    </div>
</template>

<style>
    .title {
        font-size: 16px;
        text-align: center;
    }
</style>
