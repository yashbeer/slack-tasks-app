const { health, dump } = require('./task')

const routes = [
  {
    path: '/health',
    method: ['GET'],
    handler: health,
  },
  {
    path: '/dump',
    method: ['POST'],
    handler: dump
  },
]

exports.customRoutes = routes;
