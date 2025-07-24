# rsx

```html

---
use rsx::{Request, Response, Promise};
use api::user::{UserInfo};
use api::news::{NewsInfo};

// 服务端请求
async fn get_server_side_props(req: Request) -> Response {
    let cookies = req.cookies();
    let url = req.url();
    // Promise.all
    let concurrenceTask = Promise::all!(UserInfo::from_cookies(cookies), NewsInfo::from_url(url));
    match concurrenceTask().await {
        Ok(userInfo, newsInfo) {
            let title = format!("新闻标题: {}", newsInfo.title);
            // 服务端请求成功
            return Response::json!({
                "code": 0,
                "userInfo": userInfo,
                "newsInfo": newsInfo,
                "title": title,
            });
        }
        Err(userErr, newsErr) {
            // 服务端请求失败
            return Response::json!({
                "code": -1,
                "userInfo": None,
                "newsInfo": None,
                "title": "未找到新闻",
                "error": format!("userErr: {:?}, newsErr: {:?}", userErr, newsErr),
            });
        }
    }
}
---

<script>
    import { defineProps } from 'rsx';
    // ssr components
    import Meta from '../components/meta.rsx';
    import Header from '../components/header.rsx';
    import Footer from '../components/footer.rsx';
    // csr components
    import App from '../client/react.app.tsx';
    // server props
    const { userInfo, newsInfo, title } = defineProps({});
    const version = '0.1.0';

    export default {
        components: [Meta, Header, Footer, App],
    }
</script>

<template>
    <head>
        <Meta></Meta>
        <title>{{title}}</title>
        <meta charset="UTF-8">
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    </head>
    <body>
    <div id="app">
        <Header userInfo="{{userInfo}}"></Header>
        <div class="flex">
            <App client="react"></App>
        </div>
        <Footer version="{{version}}"></Footer>
    </div>
    </body>
</template>

<style>
    #app {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .flex {
        flex: 1;
    }
</style>
```
