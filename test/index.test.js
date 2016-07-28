'use strict'

const chai = require('chai')
const CellaClient = require('../src/')
const NotImplementedError = require('../src/errors')

const expect = chai.expect

describe('CellaClient', () => {
  it('should throw Error without token', () => {
    expect(_ => { new CellaClient() }).to.throw('Token can not be null')
  })

  it('should handle .ctor options', () => {
    let client = new CellaClient('xxxx')
    expect(client.token).to.equal('xxxx')
    expect(client.rstreamAddr).to.equal('ws://stream.cella.xyz')

    client = new CellaClient({ token: 'xxxx', server: 'yyyy' })
    expect(client.token).to.equal('xxxx')
    expect(client.rstreamAddr).to.equal('yyyy')
  })

  it('should handle error when !connect', done => {
    const client = new CellaClient({ token: 'xxxx', server: 'ws://not.exist.example.com' })
    client.on('connect_error', err => {
      expect(err).to.be.a('error')
      done()
    })
  })
})

describe('composeMessage', () => {
  const client = new CellaClient('xxxx')
  it('test text message', () => {
    const o = client.composeTextMessage('wx_user_id', 'this_is_content')
    expect(o).to.eql({
      body: {
        touser: 'wx_user_id',
        msgtype: 'text',
        text: {
          content: 'this_is_content',
        },
      },
      to: 'cella-wx-touch-svc-token',
    })
  })

  it('test image message', () => {
    const o = client.composeImageMessage('wx_user_id', 'media_id')
    expect(o).to.eql({
      body: {
        touser: 'wx_user_id',
        msgtype: 'image',
        image: {
          media_id: 'media_id',
        },
      },
      to: 'cella-wx-touch-svc-token',
    })
  })

  it('test voice message', () => {
    const o = client.composeVoiceMessage('wx_user_id', 'media_id')
    expect(o).to.eql({
      body: {
        touser: 'wx_user_id',
        msgtype: 'voice',
        voice: {
          media_id: 'media_id',
        },
      },
      to: 'cella-wx-touch-svc-token',
    })
  })

  it('test rich message', () => {
    const _art = {
      title: 'title',
      description: 'description',
      url: 'url',
      picurl: 'picurl',
    }

    let o = client.composeRichMessage('wx_user_id', _art)
    expect(o).to.eql({
      body: {
        touser: 'wx_user_id',
        msgtype: 'news',
        news: {
          articles: [_art],
        },
      },
      to: 'cella-wx-touch-svc-token',
    })

    const _art2 = {
      title: 'title_2',
      description: 'description_2',
      url: 'url_2',
      picurl: 'picurl_2',
    }

    const arr = [_art, _art2]

    o = client.composeRichMessage('wx_user_id', arr)
    expect(o).to.eql({
      body: {
        touser: 'wx_user_id',
        msgtype: 'news',
        news: {
          articles: arr,
        },
      },
      to: 'cella-wx-touch-svc-token',
    })
  })

  it('video message should throw NotImplementedError', () => {
    expect(() => client.composeVideoMessage('wx_user_id', 'media_id')).to.throw(NotImplementedError)
  })
})
