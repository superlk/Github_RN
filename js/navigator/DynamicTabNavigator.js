/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createMaterialTopTabNavigator,
    createAppContainer,
    BottomTabBar,
} from 'react-navigation';
// import {BottomTabBar} from 'react-navigation-tabs';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import NavigationUtil from '../navigator/NavigationUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

import {connect} from 'react-redux';

//可配置底部tab

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor, focused}) => {
                return (<MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />)
            }
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({tintColor, focused}) => {
                return (<Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />)
            }
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({tintColor, focused}) => {
                return (<MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />)
            }
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => {
                return (<Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />)
            }
        }
    }
};

type Props = {};
export  class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    tabNavigator=()=> {
        if (this.Tabs){
            return this.Tabs;
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;  //可以请求后端，动态获取底部tab
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};  //根据需要定制动态显示的tab
        PopularPage.navigationOptions.tabBarLabel = "最新"; // 动态配置属性
        const tabNavigator=this.Tabs=createBottomTabNavigator(tabs,
            {
                // tabBarComponent: TabBarComponent
                tabBarComponent:props => {
                    return <TabBarComponent theme={this.props.theme} {...props}/>
                }
            }
        );
        return  this.Tabs=createAppContainer(tabNavigator);
    };

    render() {
        // NavigationUtil.navigation = this.props.navigation;// 上层navigation
        // const tabNavigator = this.tabNavigator();
        // const Tab = createAppContainer(tabNavigator);
        const Tab = this.tabNavigator();

        return <Tab
            onNavigationStateChange={(prevState,newState,action)=>{
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{//发送底部tab切换的事件
                    from:prevState.index,
                    to:newState.index
                })
            }}
        />
    }
}

class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime() //标志位
        }
    }

    render() {
        // const {routes, index} = this.props.navigation.state;
        // if (routes[index].params) {
        //     const {theme} = routes[index].params;
        //     // 以最新更新时间为住，防止被其他的tab之前的修改覆盖掉
        //     if (theme && theme.updateTime > this.theme.updateTime) {
        //         this.theme = theme
        //     }
        // }
        return <BottomTabBar
            {...this.props}
            // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
            activeTintColor={this.props.theme}
        />
    }

}

const mapStateToProps=state=>({
    theme:state.theme.theme
});

export default  connect(mapStateToProps)(DynamicTabNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
