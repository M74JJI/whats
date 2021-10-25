export function darkThemeReducer(state = false, action) {
    switch (action.type) {
        case 'SWITCH_THEME':
            return action.payload;
        default:
            return state;
    }
}
