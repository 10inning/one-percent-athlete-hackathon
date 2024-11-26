import { UserActionTypes } from "./User.actionTypes"

export const SetCurrentUser = (payload) => {
    return {
        type: UserActionTypes.UPDATE_USER,
        payload: payload
    }
}

export const SetCurrentUserDetails = (payload) => {
    return {
        type: UserActionTypes.UPDATE_USER_DETAILS,
        payload: payload
    }
}