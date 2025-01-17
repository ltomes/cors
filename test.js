import TestRunner from 'test-runner'
import Cors from 'lws-cors'
import Lws from 'lws'
import fetch from 'node-fetch'
import { strict as a } from 'assert'

const tom = new TestRunner.Tom()

tom.test('OPTIONS request: allow-methods in response, body empty', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return function (ctx) {
        ctx.body = 'one'
      }
    }
  }
  const lws = await Lws.create({ port, stack: [ Cors, One ] })
  try {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'OPTIONS',
      headers: {
        'origin': 'localhost-test',
        'Access-Control-Request-Method': 'GET'
      }
    })
    const body = await response.text()
    a.equal(body, '')
    a.deepEqual(response.headers.get('access-control-allow-methods'), 'GET,HEAD,PUT,POST,DELETE,PATCH' )
    a.deepEqual(response.headers.get('Access-Control-Allow-Origin'), 'localhost-test' )
  } finally {
    lws.server.close()
  }
})

tom.test('GET request: allow-methods in response, body not empty', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return function (ctx) {
        ctx.body = 'one'
      }
    }
  }
  const lws = await Lws.create({ port, stack: [ Cors, One ] })
  try {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'GET',
      headers: {
        'origin': 'localhost-test'
      }
    })
    const body = await response.text()
    a.equal(body, 'one')
    a.deepEqual(response.headers.get('Access-Control-Allow-Origin'), 'localhost-test' )
  } finally {
    lws.server.close()
  }
})

tom.test('OPTIONS request, opener-policy', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return function (ctx) {
        ctx.body = 'one'
      }
    }
  }
  const lws = await Lws.create({
    port,
    stack: [ Cors, One ],
    corsOpenerPolicy: 'same-origin'
  })
  try {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'OPTIONS',
      headers: {
        'origin': 'localhost-test',
        'Access-Control-Request-Method': 'GET'
      }
    })
    const body = await response.text()
    a.equal(body, '')
    a.deepEqual(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin' )
  } finally {
    lws.server.close()
  }
})

tom.test('GET request, opener-policy', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return function (ctx) {
        ctx.body = 'one'
      }
    }
  }
  const lws = await Lws.create({
    port,
    stack: [ Cors, One ],
    corsOpenerPolicy: 'same-origin'
  })
  try {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'GET',
      headers: {
        'origin': 'localhost-test'
      }
    })
    const body = await response.text()
    a.equal(body, 'one')
    a.deepEqual(response.headers.get('Cross-Origin-Opener-Policy'), 'same-origin' )
  } finally {
    lws.server.close()
  }
})

tom.test('GET request, embedder-policy', async function () {
  const port = 8000 + this.index
  class One {
    middleware () {
      return function (ctx) {
        ctx.body = 'one'
      }
    }
  }
  const lws = await Lws.create({
    port,
    stack: [ Cors, One ],
    corsEmbedderPolicy: 'require-corp'
  })
  try {
    const response = await fetch(`http://localhost:${port}/`, {
      method: 'GET',
      headers: {
        'origin': 'localhost-test'
      }
    })
    const body = await response.text()
    a.equal(body, 'one')
    a.deepEqual(response.headers.get('Cross-Origin-Embedder-Policy'), 'require-corp' )
  } finally {
    lws.server.close()
  }
})

export default tom
