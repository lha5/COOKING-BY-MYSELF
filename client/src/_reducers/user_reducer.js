import {
    CHECK_EMAIL,
    SIGNUP_USER,
    SIGNIN_USER,
    AUTH_USER,
    LOGOUT_USER,
} from '../_actions/types';


export default function(state={}, action) {
    switch(action.type){
        case SIGNUP_USER:
            return { ...state, signup: action.payload }
        case CHECK_EMAIL:
            return { ...state, result: action.payload }
        case SIGNIN_USER:
            return { ...state, signinSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
        default:
            return state;
    }
};