import axios from 'axios';
import {
    CHECK_EMAIL,
    SIGNIN_USER,
    SIGNUP_USER,
    AUTH_USER,
    LOGOUT_USER,
} from './types';

import { USER_SERVER } from '../components/Config.js';

export function checkEmail(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/checkEmail`,dataToSubmit)
        .then(response => response.data);

    return {
        type: CHECK_EMAIL,
        payload: request
    }
}

export function signupUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/signup`,dataToSubmit)
        .then(response => response.data);

    return {
        type: SIGNUP_USER,
        payload: request
    }
}

export function signinUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/signin`,dataToSubmit)
        .then(response => response.data);

    return {
        type: SIGNIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}