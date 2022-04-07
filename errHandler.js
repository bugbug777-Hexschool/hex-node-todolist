const headers = require('./header/baseHeader');

const errCodeInfos = {
  default: 'connect error.',
  400: {
    40001: '非法資料格式',
    40002: '資料格式錯誤',
    40003: 'data not found.',
  },
  403: 'login error',
  404: 'page not found.',
}

const errHandler = (res, statusCode, errCode) => {
  // Build err msg
  let errMsg = errCodeInfos['default'];
  if (statusCode) errMsg = errCodeInfos[statusCode]
  if (statusCode && errCode)
    errMsg = errCodeInfos[statusCode][errCode]

  let data = {
    status: 'false',
    errMsg
  }

  // 如果有 errCode 的話，更新輸出的錯誤訊息
  if (errCode) {
    data = {
      ...data,
      code: errCode,
      errMsg: `error : ${errCodeInfos[statusCode][errCode]}`,
    }
  }

  res.writeHead(statusCode, headers);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = errHandler;