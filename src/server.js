import getRandomQuote from 'get-random-quote'
import sleep from 'sleep-promise'
import config from 'config'

import Indemandly from './Indemandly'

export const CONNECT = 'connect'
export const AUTH_ADMIN = 'auth:admin'
export const CHAT_AUTH_ERROR = 'chat:auth:error'
export const CHAT_AUTH_SUCCESS = 'chat:auth:success'
export const CHAT_DATA = 'chat:data'
export const CHAT_ERROR = 'chat:error'
export const CHAT_READ = 'chat:read'
export const CHAT_MESSAGES = 'chat:messages'
export const CHAT_MESSAGE = 'chat:message'
export const CHAT_STATISTICS = 'chat:statistics'
export const CHAT_TYPING = 'chat:typing'
export const MESSAGE = 'message'
export const TYPING = 'typing'

const
  indemandly = new Indemandly({
    credentials: config.get('user'),
    endpoints: config.get('endpoints'),
  })

const getFirstActiveLiveChat = livechats => livechats.find(({ status }) => status === 'NEW')
// const getActiveLiveChats = livechats => livechats.filter(({ status }) => status === 'NEW')

export default async () => {
  console.log(`1) Logging in as ${config.get('user').email} and listing live chats...`)
  const
    // Listing all livechats
    livechats = await indemandly.getChatList()

  console.log(`2) Logged in and received ${livechats.length} live chats`)

  const
    // Gettin first alive livechat
    livechat = getFirstActiveLiveChat(livechats)

  if (!livechat) {
    throw 'Need at least one active livechat to operate properly'
  }

  console.log(`3) Selected ${livechat.uuid} for connection, requesting chat token...`)

  const
    // Receiving socket token for selected livechat
    { token } = await indemandly.getChatToken(livechat.uuid),
    socket = indemandly.getSocketIO()

  console.log(`4) Received chat connection token ${token}, connecting to socket.io...`)

  socket.on(CONNECT, () => {
    // Connected to sockets
    console.log('5) Connected to socket, emitting admin auth...')
    socket.emit(AUTH_ADMIN, { token })
  })

  socket.on(CHAT_AUTH_SUCCESS, ({ chatUUID }) => {
    // Connected to chat as admin
    console.log(`6) Admin auth accepted, connected to chat ${chatUUID}`)
  })

  socket.on(CHAT_ERROR, error => {
    // Serious problems will appear here
    console.log(`6) Fatal error: ${error}`)
  })

  socket.on(CHAT_MESSAGE, async ({ type, message }) => {
    if (type !== 'INCOMING') {
      // Message from admin to client
      return
    }

    // Received message from client
    console.log(`✉️  ${message}`)

    // Let's reply random quote to user after random amount of time

    // Get random text for reply
    const { text } = await getRandomQuote()

    // Lets wait and emit "admin is typing" each second
    const timeout = text.length / 35
    for (let i = 0; i < timeout; i++) {
      socket.emit(TYPING)
      await sleep(1000)
    }
    // Now send the message to client
    socket.emit(MESSAGE, { message: text })
  })

}
