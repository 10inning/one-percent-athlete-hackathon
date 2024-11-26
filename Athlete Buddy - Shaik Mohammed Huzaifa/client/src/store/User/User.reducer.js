import { UserActionTypes } from "./User.actionTypes"

const Inital_State = {
    user: {},
    userDetails: {}
}

export const UserReducer = (state = Inital_State, action) => {
    const {type, payload} = action
    
    if(type == UserActionTypes.UPDATE_USER){
        return {...state,
        user: payload, 
        }
    }else if(type == UserActionTypes.UPDATE_USER_DETAILS){
        return {
            ...state,
            userDetails: payload
        }
    } 
    
    return state
}