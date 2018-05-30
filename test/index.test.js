'use strict'

const nock = require('nock')
const winston = require('winston')

require('..')

let url, path, scope, logger

beforeAll(() => {
  url = 'http://localhost:5555'
  path = '/'
  scope = nock(url).post(path).reply(200)
  logger = new winston.Logger({
    transports: [
      new winston.transports.WinstonRestify({
        silent: true,
        client: {
          url
        }
      })
    ]
  })
})

describe('winston-restify tests', () => {
  test('logs a string to specified endpoint', done => {
    logger.info('hello.', {
      path
    }, () => expect(scope.isDone()).toEqual(true))
    done()
  })

  // only methods POST, PUT
  test('can send data', done => {
    logger.info('hello.', {
      path,
      data: {
        a: 1
      }
    }, () => expect(scope.isDone()).toEqual(true))
    done()
  })

  // methods GET, HEAD, POST, PUT, DEL
  test('can change http method', done => {
    const getScope = nock(url).get('/').reply(200)
    logger.info('hello.', {
      method: 'get',
      path
    }, () => expect(getScope.isDone()).toEqual(true))
    done()
  })

  test('with options', done => {
    const putScope = nock(url).put('/').reply(200)
    logger.info('hello.', {
      method: 'put',
      options: {
        path
      }
    }, () => expect(putScope.isDone()).toEqual(true))
    done()
  })

  afterEach(() => {
    nock.removeInterceptor(scope)
  })
})
