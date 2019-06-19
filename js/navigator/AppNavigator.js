import React from 'react'
import {
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createMaterialTopTabNavigator,
    createAppContainer
} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';


const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null // 通过header这是为null禁用顶部标题
        }
    }
});

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null // 通过header这是为null禁用顶部标题
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            header: null // 通过header这是为null禁用顶部标题
        }
    }
});

const swicthNavigator= createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
}, {
    navigationOptions: {
        header: null // 通过header这是为null禁用顶部标题
    },
});


export default createAppContainer(swicthNavigator)


