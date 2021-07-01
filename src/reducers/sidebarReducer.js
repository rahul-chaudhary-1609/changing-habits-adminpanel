import { SET_SIDEBAR } from '../actions/types';

const initialState = {
    sidebarShow: 'responsive',
    updatePic: () => { }
}

export default function sidebar(state = initialState, action) {

    switch (action.type) {
        case SET_SIDEBAR:
            return { ...state, sidebarShow: action.payload }
        case 'UPDATEPIC':
            return { ...state, updatePic: action.payload }
        default:
            return state
    }
}