'use strict'

const assert = require('assert-plus')
const util = require('util')
const winston = require('winston')
const clients = require('restify-clients')

const isTest = process.env.NODE_ENV === 'test'

const WinstonRestify = winston.transports.WinstonRestify = function (options) {
  assert.object(options, 'winston-restify: options')
  assert.object(options.client, 'winston-restify: client')
  assert.ok(options.client.url, 'winston-restify: Must set URL')

  const logger = this

  winston.Transport.call(logger, options)

  logger.name = 'winston-restify'
  logger.level = options.level || 'info'
  logger.silent = options.silent
  logger.dispatch = options.dispatch
  logger.client = options.client
  logger.basicAuth = options.basicAuth
  logger.debug = options.debug
  logger.prepend = options.prepend || {
    level: true,
    message: true
  }

  if (!isTest) {
    winston.remove(winston.transports.Console)
  }
}

util.inherits(WinstonRestify, winston.Transport)

WinstonRestify.prototype.name = 'winston-restify'

WinstonRestify.prototype.log = function (level, message, meta, callback) {
  const logger = this

  if (!logger.silent) {
    console._stderr.write(`${level}: ${message}\n`)
  }

  if (logger.dispatch) {
    const client = clients.createJsonClient(logger.client)

    if (logger.basicAuth) {
      const { login, password } = logger.basicAuth
      client.basicAuth(login, password)
    }

    let { options, path, method, data } = meta

    options = options || { path: path || '/' }
    method = method || 'post'
    data = data || {}

    if (logger.prepend.level) {
      data.level = level
    }

    if (logger.prepend.message) {
      data.message = message
    }

    const cb = (err, req, res, obj) => {
      callback(err)

      if (logger.debug) {
        console.log('%d!! %j', res.statusCode, res.headers)
        console.log('resonse: %j', obj)
      }
    }

    if (method === 'post' || method === 'put') {
      client[method](options, data, cb)
    } else {
      client[method](options, cb)
    }
  }
}

module.exports = WinstonRestify
