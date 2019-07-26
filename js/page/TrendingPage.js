// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */
//
// import React, {Component} from 'react';
// import {Button, StyleSheet, Text, View} from 'react-native';
// import {connect} from 'react-redux';
//
// import action from '../action/index';
//
// type Props = {};
// export class TrendingPage extends Component<Props> {
//
//     render() {
//         const {navigation} = this.props;
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>TrendingPage2</Text>
//                 <Button title={'改变主题颜色'}
//                         onPress={() => {
//                             // navigation.setParams({
//                             //     theme: {
//                             //         tintColor: 'red',
//                             //         updateTime: new Date().getTime()
//                             //     }
//                             // })
//                             this.props.onThemeChange('#096')
//                         }}/>
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//     },
//     instructions: {
//         textAlign: 'center',
//         color: '#333333',
//         marginBottom: 5,
//     },
// });
//
// const mapStateToProps=state=>({})
//
//
// const  mapDispatchToProps=dispatch=>({
//     onThemeChange:theme=>dispatch(action.onThemeChange(theme))
// })
//
// export default  connect(mapStateToProps,mapDispatchToProps)(TrendingPage)


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil';
import DetailPage from "./DetailPage";
import FetchDemoPage from "./FetchDemoPage";
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';//三方插件
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = "#678";
type Props = {};
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['ALL', 'C', 'C#', 'PHP','JavaScript','React', 'React Native', 'Python']
    }

    // 动态获取tab数据
    genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} tabLabel={item}/>, //传数据
                // screen:PopularTab,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'趋势'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;
        const TopNavigator = createMaterialTopTabNavigator(
            //     {
            //     PopularTab1: {
            //         screen: PopularTab,
            //         navigationOptions: {
            //             title: 'Tab1'
            //         }
            //     },
            //     PopularTab2: {
            //         screen: PopularTab,
            //         navigationOptions: {
            //             title: 'Tab2'
            //         }
            //     }
            //
            // }
            this.genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,//样式
                    upperCaseLabel: false,// 是否使标签大写，默认是true
                    scrollEnabled: true,// 是否支持滚动，默认是false
                    style: {
                        backgroundColor: '#678' // 背景色
                    },
                    indicatorStyle: styles.indicatorStyle, //标签指示器的样式
                    labelStyle: styles.labelStyle,//字体样式

                }
            }
        );

        const Top = createAppContainer(TopNavigator);
        return (
            <View style={{flex: 1, marginTop: 40}}>
                {navigationBar}
                <Top/>

            </View>
        );
    }
}


const URL = "https://github.com/trending/";
const QUERY_STR = "&sort=stars";

const pageSize = 10;

class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(loadMore) {
        const {onloadTrendingData, onLoadMoreTrending} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onloadTrendingData(this.storeName, url, pageSize)
        }

    }

    _store() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true,
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + "?since=daily";
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem item={item}
                            onSelect={() => {
                            }
                            }
        />
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多....</Text>
            </View>
    }

    render() {
        // const {popular} = this.props;
        // let store = popular[this.storeName];//动态获取state
        // if (!store) {
        //     store = this._store()
        // }
        let store = this._store();

        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={items => "" + (items.id || items.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={'red'}
                            colors={['red']}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tinColor={"red"}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        this.loadData(true)
                        // console.log("------")

                        // if (this.canLoadMore) {
                        //     console.log("------")
                        //     this.loadData(true)
                        //     this.canLoadMore = false
                        // }

                    }}
                    onEndReachedThreshold={0.5}
                    // onMomnetumScrollBegin={() => {
                    //     console.log('2222')
                    //     this.canLoadMore = true
                    // }
                    // }
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>)
    }
}

const mapStateTopProps = state => ({
    trending: state.trending
});

const mapDispatchToProps = dispatch => ({
    onloadTrendingData: (storeName, url, pageSize) => dispatch(actions.onloadTrendingData(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, callBack))
});

const TrendingTabPage = connect(mapStateTopProps, mapDispatchToProps)(TrendingTab);


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
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
