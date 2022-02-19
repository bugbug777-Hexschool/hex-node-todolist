function errHandler(res, header, statusCode, message) {
  res.writeHead(statusCode, header);
  res.write(JSON.stringify({
    status: 'false',
    message
  }));
  res.end();
}

module.exports = errHandler;