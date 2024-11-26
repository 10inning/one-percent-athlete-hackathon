// Action Types
export const athleteDetailsActionTypes = {
  UPDATE_ATHLETE_DETAILS: "update/@athlete_details",
  UPDATE_ATHLETE_DETAILS_TOGGLE: "update/@athlete_toggle",
};

// Action Creators
export const updateAthleteDetails = (details) => ({
  type: athleteDetailsActionTypes.UPDATE_ATHLETE_DETAILS,
  payload: details,
});

export const toggleAthleteDetails = () => ({
  type: athleteDetailsActionTypes.UPDATE_ATHLETE_DETAILS_TOGGLE,
});

// Initial State
const initial_state = {
  athlete: {}, // Holds athlete details
  athlete_toggle: false, // Tracks toggle state
};

// Reducer
export const AthleteDetailsReducer = (state = initial_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case athleteDetailsActionTypes.UPDATE_ATHLETE_DETAILS:
      return {
        athlete: payload, // Update athlete details
      };

    case athleteDetailsActionTypes.UPDATE_ATHLETE_DETAILS_TOGGLE:
      return {
        ...state,
        athlete_toggle: !state.athlete_toggle, // Toggle state
      };

    default:
      return state;
  }
};

// Selectors
export const AthleteSelector = (state) => state.Athlete.athlete;

export const SelectAthleteToggle = (state) => state.Athlete.athlete_toggle;
