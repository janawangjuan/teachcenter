const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

// $ GET /package.json
app.use(serve('./src'));

// $ GET /hello.txt
app.use(serve('test/fixtures'));

// or use absolute paths
app.use(serve(__dirname + '/test/fixtures'));

app.listen(3030);

console.log('listening on port 3030');
console.log('eg: http://localhost:3030/index.html?ccid=313A5C7994F57292&seek=22');