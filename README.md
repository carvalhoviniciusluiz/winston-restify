# winston-restify
Another transport to sending logs with winston. Inspired by [winston-endpoint](https://github.com/gswalden/winston-endpoint)

[![standard][standard-image]][standard-url]
[![travis][travis-image]][travis-url]
[![Code Coverage][coverage-image]][coverage-url]
[![npm][npm-image]][npm-url]

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[travis-image]: https://travis-ci.org/carvalhoviniciusluiz/winston-restify.svg?branch=master
[travis-url]: https://travis-ci.org/carvalhoviniciusluiz/winston-restify
[coverage-image]: https://scrutinizer-ci.com/g/carvalhoviniciusluiz/winston-restify/badges/quality-score.png?b=master
[coverage-url]: https://scrutinizer-ci.com/g/carvalhoviniciusluiz/winston-restify/?branch=master
[npm-image]: https://img.shields.io/npm/v/winston-restify.svg?style=flat
[npm-url]: https://npmjs.org/package/winston-restify


### Installation:
```
npm install winston-restify --save
```

### Note:
Requires Node ``>8.0.0``.

### API Options:
Key | Description
------------ | -------------
level | [logging-levels](https://github.com/winstonjs/winston#logging-levels)
silent | setting to true will turn the console transport off (default: false)
dispatch | setting to false will disable log shipping (default: true)
client | [api-options](https://github.com/restify/clients#api-options)
basicAuth | [description](https://github.com/restify/clients#basicauthusername-password)
debug | print responses status
prepend | sends the level and message to request (default: { level: true, message: true })

### Meta Options:
Key | Description
------------ | -------------
method | HTTP method (default: post)
path | endpoint api (default: '/')
data | object for sending, supported in POST methods, PUT (default: {})

### Example:
This example is [available here as well](./example/server.js).
```javascript
'use strict'

const restify = require('restify')
const winston = require('winston')
const winstonRestify = require('winston-restify')

winston
  // HTTP transport included to winston
  .add(
    winstonRestify, {
      silent: true,
      dispatch: true,
      debug: true,
      client: {
        url: 'http://localhost:8080/logger'
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


```
### Tests
```shell
npm test
```
## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present
