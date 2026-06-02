/**
 * 本地静态文件服务器 - 在浏览器中打开 http://localhost:3888
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3888;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url).replace(/\?.*$/, '') || '/';
  if (urlPath === '/') urlPath = '/index.html';
  // 去掉开头的 / 避免在 Windows 上 path.join 得到错误路径
  const relativePath = urlPath.replace(/^\//, '').replace(/\//g, path.sep);
  const filePath = path.join(ROOT, relativePath);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  本地服务器已启动');
  console.log('  在 Cursor 的浏览器页面中打开: http://localhost:' + PORT);
  console.log('');
  console.log('  常用页面:');
  console.log('  - http://localhost:' + PORT + '/body%20metrics-app/身体指标统计-原型演示-移动端.html');
  console.log('  - http://localhost:' + PORT + '/body%20metrics/身体指标统计-原型演示.html');
  console.log('');
  console.log('  按 Ctrl+C 停止服务器');
  console.log('');
});
