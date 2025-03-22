export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 处理根路径请求
        if (url.pathname === '/') {
            return Response.redirect(`${url.origin}/monster-survivors`, 301);
        }

        // 设置安全headers
        const headers = new Headers({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self' https://cdn.tailwindcss.com https://cloud.onlinegames.io; frame-src https://cloud.onlinegames.io; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline'",
        });

        // 获取静态资源
        try {
            let response = await env.ASSETS.fetch(request);

            // 复制原始响应并添加安全headers
            response = new Response(response.body, response);
            for (const [key, value] of headers.entries()) {
                response.headers.set(key, value);
            }

            // 为HTML文件设置正确的Content-Type
            if (url.pathname.endsWith('.html')) {
                response.headers.set('Content-Type', 'text/html; charset=UTF-8');
            }

            return response;
        } catch (e) {
            return new Response('404 Not Found', { status: 404 });
        }
    }
}