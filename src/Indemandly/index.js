import axios from 'axios'
import io from 'socket.io-client'

const wrapData = ({ data }) => data

export default class Indemandly {
  constructor ({ credentials, endpoints}) {
    if (!credentials || !credentials.email || !credentials.password) {
      throw 'Credentials should contain email and password'
    }

    if (!endpoints || !endpoints.api || !endpoints.apiPath) {
      throw 'Endpoints should be configured properly'
    }

    this.credentials = credentials
    this.endpoints = endpoints
    this.apiUrl = `${endpoints.api}/${endpoints.apiPath}`
    this.socketUrl = endpoints.api
    this.headers = {}
    this.scoket = null
  }

  async _login () {
    let result
    try {
      result = await axios.post(`${this.apiUrl}/login`, this.credentials)
    } catch (error) {
      throw 'Login failed, check endpoint, email and password'
    }

    if (!result.data.user || !result.headers['set-cookie'] || !result.headers['set-cookie'][0]) {
      throw 'Login failed, check email and password'
    }

    this.headers.cookie = result.headers['set-cookie']
    this.user = result.data.user
    return this.user
  }

  async _getHeaders () {
    if (this.headers.cookie) {
      return this.headers
    }
    await this._login()
    return this.headers
  }

  async _get (path) {
    return axios.get(`${this.apiUrl}/${path}`, { headers: await this._getHeaders() }).then(wrapData)
  }

  // not tested
  async _post (path, data) {
    return axios.post(`${this.apiUrl}/${path}`, data, { headers: await this._getHeaders() }).then(wrapData)
  }

  getSocketIO () {
    if (!this.socket) {
      this.socket = io(this.socketUrl)
    }
    return this.socket
  }

  async getUser () {
    return this._get('user')
  }

  async getChatList () {
    return this._get('chat/list')
  }

  async getChatToken (chatUUID) {
    return this._get(`chat/token/${chatUUID}`)
  }

}
