import cluster from "cluster"
import PusherServer from "pusher"
import PusherClient from "pusher-js"


export const pusherServer = new PusherServer({
  appId: process.env.REACT_APP_PUSHER_APP_ID!,
  key: process.env.REACT_APP_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.REACT_APP_PUSHER_SECRET!,
  cluster: 'ap1',
  useTLS: true
})

export const pusherClient = new PusherClient(
  process.env.REACT_APP_PUBLIC_PUSHER_APP_KEY!, {
      cluster: 'ap1'
});
