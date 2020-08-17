import * as actions from "../constants/index";
export function increment(num){
    return {
        type:actions.INCREMENT,
        num
    }
}
export function decrement(num){
    return {
        type:actions.DECREMENT,
        num
    }
}