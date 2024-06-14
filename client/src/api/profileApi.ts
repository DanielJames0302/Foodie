import {Dispatch} from 'redux'
import {toast} from 'react-toastify';
import { makeRequest } from '../axios';
import { 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_FRIENDS, 
    SEND_FRIEND_REQUEST, 
    ACCEPT_FRIEND_REQUEST,
    FETCH_CURRENT_PROFILE,
    FETCH_CURRENT_PROFILE_POSTS,
    UPDATE_PROFILE_DESCRIPTION,
    SET_CURRENT_PROFILE_USERNAME,
    FIND_USERNAME_MATCHES,
    CLEAR_MATCHES,
    HIDE_SEARCHING_RESULTS,
    GET_SEARCHING_RESULTS,
    FETCH_SENDED_FRIEND_REQUESTS,
    SET_CAN_CLICK_REQUEST_BUTTON,
    CANCEL_FRIEND_REQUEST,
    REMOVE_FRIEND
} from '../actionTypes/profileActionTypes';


export const getFollowRequests = (userId: number, profileId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await makeRequest.get(`/follow_requests`)
      dispatch({type: FETCH_PROFILE, payload: {profile: res.data}});
    } catch (err) {
      toast.error("Friend requests couldn't be fetched")
    }
  }
}