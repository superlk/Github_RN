import {combineReducers} from "redux";
import theme from './theme';
import popular from './popular';
import {rootCom,RootNavigator} from '../navigator/AppNavigator';


/**
 * 1,指定默认state
 */
const  navState=RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 2, 创建自己的navigation reducer
 */
const navReducer =(state=navState,action)=>{
    const  nextState=RootNavigator.router.getStateForAction(action,state);
    return nextState||state;  // 如果nextState为null，值需要返回原来的state
};

/**
 * 3.合并reducer
 */
const  index=combineReducers({
    nav:navReducer,
    theme:theme,
    popular:popular,
});

export default index;
