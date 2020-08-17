import * as actions from "../constants/index";
const counter = (state = 0,action) => {
    switch (action.type) {
        case actions.INCREMENT:
            return state + action.num
        case actions.DECREMENT:
            return state - action.num
        default :
            return state
    }
}
export default counter