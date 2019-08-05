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
import WebViewPage from '../page/WebViewPage';
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage';
import DataStoreDemoPage from '../page/DataStoreDemoPage';
import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers'

export const rootCom = "Init"; // 设置根路由

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
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            header: null // 通过header这是为null禁用顶部标题
        }
    },
    // AsyncStorageDemoPage: {
    //     screen: AsyncStorageDemoPage,
    //     navigationOptions: {
    //         header: null // 通过header这是为null禁用顶部标题
    //     }
    // },
    // DataStoreDemoPage: {
    //     screen: DataStoreDemoPage,
    //     navigationOptions: {
    //         header: null // 通过header这是为null禁用顶部标题
    //     }
    // }
});

export const RootNavigator = createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
}, {
    navigationOptions: {
        header: null // 通过header这是为null禁用顶部标题
    },
});

export const middleware = createReactNavigationReduxMiddleware(
    // 'root',  // 使用createReduxContainer ，不需要这个，
    state => state.nav);

const AppWithNavigationSate = createReduxContainer(RootNavigator, 'root'); //reduxifyNavigator 已经弃用，该用createReduxContainer

const mapStateToProps = state => ({
    state: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationSate);
// export default createAppContainer(RootNavigator)


