import Cookies from 'js-cookie'
import Push from 'push.js'

import { notificationKey } from '@/services/notification/notification.query'
import { useQueryClient } from '@tanstack/react-query'

export const useWebSocket = () => {
  const queryClient = useQueryClient()

  const token = Cookies.get('access_token')

  const websocket = new WebSocket(import.meta.env.VITE_SOCKET_API_URL)

  const webSocket = () => {
    const token = Cookies.get('access_token')

    websocket.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data)

      if (data.cmd === 'BACKEND_POST_NOTIFICATION') {
        queryClient.invalidateQueries({ queryKey: notificationKey.lists() })
        Push.create('Thông báo mới', {
          body: 'Kiểm tra thông báo của bạn',
          icon: '/logo.svg',
          timeout: 4000,
        })
      }
    }

    websocket.onopen = () => {
      var client_info = {
        cmd: 'CLIENT_INFO',
        platform: 0,
        clientVersion: '1.0',
        lang: 'vi',
        token,
        app: 'CLIENT_APP',
        data: {
          app: 'CLIENT_APP',
        },
      }
      doSend(JSON.stringify(client_info))
    }

    websocket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const doSend = (message: string) => {
    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send(message)
    } else {
      console.error('WebSocket is in CLOSING or CLOSED state.')
    }
  }

  const doPing = () => {
    var pingRequest = {
      cmd: 'CLIENT_PING',
      platform: 0,
      clientVersion: '1.0',
      lang: 'vi',
      token,
      app: 'CLIENT_APP',
      data: {
        app: 'CLIENT_APP',
      },
    }
    doSend(JSON.stringify(pingRequest))
  }

  const init = () => {
    webSocket()
    setInterval(() => {
      doPing()
    }, 30000)
  }

  return { init }
}
