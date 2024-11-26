import { GroupActionsTypes } from "./Groups.actionTypes";

const inital_State = {
    travelling_groups: []
}

export const GroupsReducer = (state = inital_State, action) => {
    const {type, payload} = action;

    if(type == GroupActionsTypes.UPDATE_GROUPS){
        return {
            ...state,
            travelling_groups: payload
        }
    }

    return state
}