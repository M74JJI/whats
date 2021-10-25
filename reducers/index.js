import { combineReducers } from 'redux';
import { darkThemeReducer } from './darkThemeReducer';
export const rootReducer = combineReducers({
    darkTheme: darkThemeReducer,
});

export default rootReducer;
