process.env.NODE_ENV = 'development'

const
  chai = require('chai'),
  { expect } = chai,
  chaiHttp = require('chai-http'),
  asyncServer = require('../build')

let server

chai.use(chaiHttp)

describe('express', () => {

  before(async () => {
    console.log('[.] Waiting for server...')
    server = await asyncServer
    console.log('[+] Server ready')
  })

  after(() => {
    console.log('[.] Stopping server...')
    server.close()
    console.log('[+] Server stopped')
  })

  describe('GET /api/v1/example/test', () => {
    it('Example should return {"test": true} json', done => {
      chai.request(server)
        .get('/api/v1/example/test')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.an('object')
          expect(res.body.test).to.be.an('boolean')
          done()
        })
    })
  })

  describe('GET /api/v1/unknown', () => {
    it('Unknown url should return 404 status and have error object in json', done => {
      chai.request(server)
        .get('/api/v1/unknown')
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res).to.be.json
          expect(res.body).to.be.an('object')
          expect(res.body.error).to.be.an('object')
          done()
        })
    })
  })

  describe('GET /api/v1/example/error', () => {
    it('Unknown url should return 500 status and have error object in json', done => {
      chai.request(server)
        .get('/api/v1/example/error')
        .end((err, res) => {
          expect(res).to.have.status(500)
          expect(res).to.be.json
          expect(res.body).to.be.an('object')
          expect(res.body.error).to.be.an('object')
          done()
        })
    })
  })

})
