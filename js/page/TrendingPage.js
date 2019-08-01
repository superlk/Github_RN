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
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil';
import DetailPage from "./DetailPage";
import FetchDemoPage from "./FetchDemoPage";
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';//三方插件
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from "../common/TrendingDialog";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import PopularItem from "./PopularPage";
import FavoriteDao from "../expand/dao/FavoriteDao";
import EventBus from 'react-native-event-bus';
import EventTypes from "../util/EventTypes";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);


const THEME_COLOR = "#678";
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
type Props = {};
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['Python', 'C', 'C#', 'PHP', 'JavaScript', 'React', 'React Native',]
        this.state = {
            timeSpan: TimeSpans[0],
        }
    }

    // 动态获取tab数据
    genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>, //传数据
                // screen:PopularTab,
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref='button'
                underlayColor='transparent'
                onPress={() => this.dialog.show()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: '400'
                        }}>
                        趋势 {this.state.timeSpan.showText}
                        <MaterialIcons
                            name={'arrow-drop-down'}
                            size={22}
                            style={{color: 'white'}}
                        />
                    </Text>
                </View>

            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)//发送事件
    }

    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }

    _tabNav() {
        if (!this.tabNav) {
            this.tabNav = createMaterialTopTabNavigator(
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

        }
        return this.tabNav
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            // title={'趋势'}
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;


        const Top = createAppContainer(this._tabNav());
        return (
            <View style={{flex: 1, marginTop: 40}}>
                {navigationBar}
                <Top/>
                {this.renderTrendingDialog()}

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
        const {tabLabel, timeSpan} = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan
    }

    componentDidMount() {
        this.timeSpanCHangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData()
        });
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabChangeListener = data => {
            if (data.to === 1 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount() {
        if (this.timeSpanCHangeListener) {
            this.timeSpanCHangeListener.remove()
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabChangeListener)
    }

    loadData(loadMore, refreshFavorite) {
        const {onloadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)

        } else {
            onloadTrendingData(this.storeName, url, pageSize, favoriteDao)
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
        return URL + key + '?' + this.timeSpan.searchText;
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE.flag_trending, callback}, 'DetailPage')
            }
            }
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}

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
                    data={store.projectModels}
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
    onloadTrendingData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadTrendingData(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))

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
