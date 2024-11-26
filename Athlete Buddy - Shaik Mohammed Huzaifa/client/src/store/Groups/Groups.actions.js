import { GroupActionsTypes } from "./Groups.actionTypes"

export const UpdateGroups = (payload) => {
    return {
        type: GroupActionsTypes.UPDATE_GROUPS,
        payload: payload
    }
}