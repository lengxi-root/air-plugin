<?php
// 检查是否通过 GET 请求传递了 URL 参数
if (isset($_GET['url'])) {
    // 获取传递的 URL 参数，并进行 URL 解码
    $originalUrl = urldecode($_GET['url']);

    // 如果链接不包含 http:// 或 https:// 则补全
    if (!preg_match('/^(https?:\/\/)/', $originalUrl)) {
        $originalUrl = 'https://'. $originalUrl;
    }

    // 读取 bmd.ini 中的白名单域名
    $whitelist = file('bmd.ini', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    // 检查当前 URL 是否在白名单中
    $isWhitelisted = false;
    foreach ($whitelist as $domain) {
        if (strpos($originalUrl, $domain)!== false) {
            $isWhitelisted = true;
            break;
        }
    }

    // 如果在白名单中，进行重定向
    if ($isWhitelisted) {
        header('Location: '. $originalUrl);
        exit;
    } else {
        // 如果不在白名单，显示错误信息
        echo 'This URL is not allowed for redirection.';
        exit;
    }
} else {
    // 如果没有 URL 参数，显示错误信息
    echo 'No URL specified';
    exit;
}
?>