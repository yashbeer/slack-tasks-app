const getRawBody = require('raw-body');


module.exports = async(req) => {
  const rawBody = await getRawBody(req);
  return JSON.parse(rawBody.toString());
}
