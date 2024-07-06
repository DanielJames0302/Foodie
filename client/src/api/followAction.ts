import { toast } from "react-toastify"
import { makeRequest } from "../axios"

interface HandleFriendRequestParams {
  sender_profile_id: number;
  option: string;
}

export const sendFollowRequests = async (userId: number, following: boolean) => {
  const response = await makeRequest.post("/send_follow_request/" + userId);
  if (response.status !== 200) console.log(response)

  return;
}

export const fetchFollowRequests = async () => {
  const response = await makeRequest.get('/follow_requests')

  if (response.status !== 200) {
    throw new Error('Network response was not ok');
  }

  if (!response.data) {
    throw new Error('Data is undefined');
  }


  return response.data
}

export const handldeFollowRequests = async ({sender_profile_id, option}: HandleFriendRequestParams) => {
  if (option === 'accept') {
    const response = await makeRequest.post(`/accept_friend_request/${sender_profile_id}`)
    if (response.status !== 200) {
      toast('Network response not ok')
    }
    toast(`You have accepted follow request`)
    return;
  }
  const response = await makeRequest.delete(`/decline_friend_request/${sender_profile_id}`)
  if (response.status !== 200) {
    toast('Something went wrong')
  }
  toast(`You have declined follow request`)
  return;
}