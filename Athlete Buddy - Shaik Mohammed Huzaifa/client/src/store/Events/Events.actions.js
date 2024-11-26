import { EventActionTypes } from "./Events.actionTypes"

export const UpdateEvents = (payload) => {
    return {
        type: EventActionTypes.UPDATE_EVENT,
        payload: payload
    }
}