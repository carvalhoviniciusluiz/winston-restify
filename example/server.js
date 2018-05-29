'use strict'

const restify = require('restify')
const winston = require('winston')
const winstonRestify = require('..')

winston
  // HTTP transport included to winston
  .add(
    winstonRestify, {
      dispatch: true,
      client: {
        url: 'http://localhost:8080'
      }
    }
  )
  // remove transport from the logger to terminal
  .remove(winston.transports.Console)

const server = restify.createServer()

server.get('/', function (req, res, next) {
  winston.info('sending_logger', {
    method: 'get',
    path: '/logger'
  })
  res.send(200, { info: 'see your terminal!!' })
  next()
})

server.get('/logger', function (req, res, next) {
  console.log('hello logger!!!!')
  next()
})

server.listen(8080, function () {
  console.log('listening on http://localhost:8080/')
})
