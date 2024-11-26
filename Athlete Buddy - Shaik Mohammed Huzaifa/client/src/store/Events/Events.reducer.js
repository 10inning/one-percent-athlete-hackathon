import { EventActionTypes } from "./Events.actionTypes"

const inital_state = {
    cultural_events: []
}

export const EventsReducer = (state = inital_state, action) => {
    const {type, payload} = action

    if(type == EventActionTypes.UPDATE_EVENT){
        return {
            ...state,
            cultural_events: payload
        }
    }

    return state
}