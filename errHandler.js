const headers = require('./header/baseHeader');

function errHandler(res, statusCode, message) {
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify({
    status: 'false',
    message
  }));
  res.end();
}

module.exports = errHandler;