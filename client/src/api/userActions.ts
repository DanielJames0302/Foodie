import axios from 'axios';
import { LOGIN, LOG_OUT, REGISTER_USER, VERIFY_USER } from '../actionTypes/userActionTypes';
import {Dispatch} from 'redux'
import { FORM_ERROR_OCCURED } from '../actionTypes/layoutActionTypes';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../axios';
import { verify } from 'crypto';


export const userApi = {
  login: (formValues: Object) => {
    return makeRequest.post("auth/login", formValues)
  },
  register: (formValues: Object) => {
    return makeRequest.post("auth/register", formValues)
  },
  verify: async (userId: number) => {
    return makeRequest.get(`auth/verify_user/${userId}`)
  },
  logout: () => {
    return makeRequest.delete('auth/logout')
  }
}

export const registerUser = (formValues: Object) => {
  return async (dispatch:Dispatch) => {
      try {
        const res =  await axios.post("http://localhost:8080/api/auth/register", formValues);  
        dispatch({type: REGISTER_USER, payload: res.data});
      } catch (err: any) {
        dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "username"}})
      }
  } 
}

export const login = createAsyncThunk('users/login',(formValues: Object) => {
  return async (dispatch: Dispatch) => {
      try {
          const res = await axios.post("http://localhost:8080/api/auth/login", formValues, {
            withCredentials: true,
          }); 
          dispatch({type: LOGIN, payload: res.data});
      } catch (err: any) {
          dispatch({type: FORM_ERROR_OCCURED, payload: {error: err.response.data.error, inputName: "email"}});
      }
  }
})


export const logOut = (userId: number, profileId: number) => {
  return async (dispatch: Dispatch) => {
      try {
          await axios.delete(`http://localhost:8080/api/auth/logout`, {withCredentials: true});
          localStorage.removeItem("user");

          dispatch({type: LOG_OUT})
      } catch (err) {
          toast.error("Couldn't log out");
      }
  }
}
