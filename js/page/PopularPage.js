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
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';//三方插件
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from 'react-native-event-bus';
import EventTypes from "../util/EventTypes";

const THEME_COLOR = "#678";
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};

export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'Python']
    }

    // 动态获取tab数据
    genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>, //传数据
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
            title={'最热'}
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


const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";

const pageSize = 10;

class PopularTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
        this.isFavoriteChanged = false
    }

    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabChangeListener = data => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabChangeListener)
    }

    loadData(loadMore, refreshFavorite) {
        const {onloadPopularData, onloadMorePopular,onFlushPopularFavorite} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onloadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName,store.pageIndex,pageSize,store.items,favoriteDao)

        } else {
            onloadPopularData(this.storeName, url, pageSize, favoriteDao)
        }

    }

    _store() {
        const {popular} = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item;
        // console.log("item>>>",item.isFavorite)
        return <PopularItem
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE.flag_popular, callback}, 'DetailPage')
            }
            }
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
        // }s
        let store = this._store();


        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={'red'}
                            colors={['red']}
                            // refreshing={store.isLoading}
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
    popular: state.popular
});

const mapDispatchToProps = dispatch => ({
    onloadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadPopularData(storeName, url, pageSize, favoriteDao)),
    onloadMorePopular: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

const PopularTabPage = connect(mapStateTopProps, mapDispatchToProps)(PopularTab);


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
