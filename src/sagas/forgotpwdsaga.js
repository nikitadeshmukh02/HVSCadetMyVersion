import {
    all,
    actionChannel,
    call,
    put,
    take,
    takeEvery,
    takeLatest,
    select,
    cancel,
    cancelled,
    fork,
    race,
    apply
  } from "redux-saga/effects";
  import { delay, buffers, eventChannel, END } from "redux-saga";
  import * as _ from "lodash";
  import * as io from "socket.io-client";
  import { types as forgotPWDTypes } from "reducers/forgotpwdreducer";
  
  //import { push } from 'react-router-redux';
  
  const attribApi = {
    
    checkEmail(email) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
  
      //new Promise((resolve, reject) => {
      //return fetch("http://localhost:3003/sendEmail/", {
        return fetch("http://hvs.selfip.net:3003/sendEmail/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hv_email: email
        })
      })
        .then(statusHelper)
        .then(response => response.json())
        .catch(error => error);
    }
    //.then(data => data)
  };
  
  function statusHelper(response) {
    debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
      //throw Error(response);
    }
    return response;
  }
  
  function* checkEmail(email) {
    debugger;
    try {
      //yield call(delay, 5000)
      //yield put({ type: forgotPWDTypes.LOGIN_REQUEST, isLoading: false })
      const resultObj = yield call(attribApi.checkEmail, email);
  
      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: forgotPWDTypes.MESSAGE,
          message: {val:-1,msg:resultObj.response.statusText}
        });
      } else {
        debugger;
        //sessionStorage.setItem("token", JSON.parse(resultObj).token);
        yield put({
          type: forgotPWDTypes.MESSAGE,
          message: JSON.parse(resultObj).result
        });
      }
      //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
      /*
      debugger;
      let message;
      switch (error.status) {
        case 500:
          message = "Internal Server Error";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        default:
          message = "Something went wrong! " + error.statusText;
      }
      */
      debugger;
      yield put({ type: forgotPWDTypes.MESSAGE, message: e });
    } finally {
      debugger;
      if (yield cancelled())
        yield put({ type: forgotPWDTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  
  
  export function* handleRequest(action) {
    debugger;
    console.log("forgotPwdSaga request", action);
    //console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
      switch (action.type) {
      
        case forgotPWDTypes.CHECK_EMAIL_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(checkEmail, action.email);
          debugger;
          break;
        }
  
        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: forgotPWDTypes.MESSAGE, error: e });
    }
  }
  