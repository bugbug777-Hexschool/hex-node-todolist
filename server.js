const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandler = require('./errHandler');

const todos = [
  {
    title: '早上起床刷刷牙',
    id: uuidv4()
  }
]

const requestListener = (req, res) => {
  const header = {
    'Access-Control-Allow-Headers': 'Conten-Type, Content-Length, Authorization, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/json'
  };
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  })

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, header);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.url === '/todos' && req.method === 'POST'){
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        const obj = {
          title,
          id: uuidv4()
        }
        if (title !== undefined) {
          todos.push(obj);
          res.writeHead(200, header);
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
          }));
          res.end();
        } else {
          errHandler(res, header, 400, '資料格式有誤')
        }
      }catch{
        errHandler(res, header, 400, '這不是 JSON')
      }
    })
    
  } else if (req.url === '/todos' && req.method === 'DELETE'){
    todos.length = 0;
    res.writeHead(200, header);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE'){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, header);
      res.write(JSON.stringify({
        status: 'success',
        data: todos
      }));
      res.end();
    } else {
      errHandler(res, header, 400, '請確認 id 是否正確');
    }
    
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH'){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(item => item.id === id);
    if (index !== -1) {
      req.on('end', () => {
        try{
          const title = JSON.parse(body).title;
          const obj = {
            title,
            id
          }
          if (title !== undefined) {
            todos[index] = obj;
            res.writeHead(200, header);
            res.write(JSON.stringify({
              status: 'success',
              data: todos,
            }));
            res.end();
          } else {
            errHandler(res, header, 400, '資料格式有誤')
          }
        }catch{
          errHandler(res, header, 400, '這不是 JSON')
        }
      })
    } else {
      errHandler(res, header, 400, '請確認 id 是否正確');
    }
  } else if (req.method === 'OPTIONS'){
    res.writeHead(200, header);
    res.end();
  } else {
    errHandler(res, header, 404, 'Not Found!!')
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);