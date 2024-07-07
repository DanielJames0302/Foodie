import PusherClient from "pusher-js"


export const pusherClient = new PusherClient(
  process.env.REACT_APP_PUBLIC_PUSHER_APP_KEY!, {
    channelAuthorization: {
      endpoint: 'http://localhost:8080/api/pusher/auth',
      transport: 'ajax',
    },
    cluster: 'ap1',
 
});


