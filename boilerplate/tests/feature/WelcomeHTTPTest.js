/**
 * This test is a demonstration how to get HTTP end-points tested
 * you can remove it harming nothing
 */

const supertest = require('supertest')

/**
 * @type {App}
 */
const app = require('../../bootstrap')

describe(`Welcome HTTP`, () => {
  let expressApp, request

  beforeAll((done) => {
    app
      .register()
      .boot()

    try {
      expressApp = app.get('expressApp')
      request = supertest(expressApp)
    } catch (e) {
      console.log(e.message)
    }
    done()
  })


  it(`Welcome end-point`, async (done) => {
    const res = await request.get('/api/v1/welcome')

    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual({
      message: `Toweran is on!`
    })

    done()
  })
})