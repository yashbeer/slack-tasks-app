const { jsonParser } = require('../utils');

exports.health = async (req, res) => {
  // const body = await jsonParser(req)
  // console.log(body)

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({'message': 'Up and running...'}));
}

exports.dump = async (req, res) => {
  const body = await jsonParser(req)

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(body));
}
