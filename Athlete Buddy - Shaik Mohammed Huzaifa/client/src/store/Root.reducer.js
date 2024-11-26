import { combineReducers } from "redux";
import { UserReducer } from "./User/User.reducer";
import { promptReducer } from "./prompt/prompt.reducer";
import { AthleteDetailsReducer } from "./athlete-details";

export const RootReducer = combineReducers({
  User: UserReducer,
  Athlete: AthleteDetailsReducer,
  Prompts: promptReducer,
});
