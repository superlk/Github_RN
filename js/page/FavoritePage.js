// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */
//
// import React, {Component} from 'react';
// import {Button, Platform, StyleSheet, Text, View} from 'react-native';
// import {connect} from 'react-redux';
//
// import action from '../action/index';
//
// type Props = {};
//   class FavoritePage extends Component<Props> {
//   render() {
//     const {navigation} = this.props;
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>FavoritePage</Text>
//         <Button title={'改变主题颜色'}
//                 onPress={() => {
//                   // navigation.setParams({
//                   //   theme: {
//                   //     tintColor: 'green',
//                   //     updateTime: new Date().getTime()
//                   //   }
//                   // })
//                   this.props.onThemeChange("#206")
//                 }}/>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
//
// const mapStateToProps=state=>({});
// const mapDispatchToProps=dispatch=>({
//   onThemeChange:theme=>dispatch(action.onThemeChange(theme))
// });
//
// export default  connect(mapStateToProps,mapDispatchToProps)(FavoritePage)


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
import TrendingItem from "../common/TrendingItem";
import {onLoadFavoriteData} from "../action/favorite";

const THEME_COLOR = "#678";
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
type Props = {};

export default class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['最热', '趋势']
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;
        const TopNavigator = createMaterialTopTabNavigator(
            {
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
                    navigationOptions: {
                        title: '最热'
                    }
                },
                'Trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
                    navigationOptions: {
                        title: '趋势'
                    }
                },
            }, {
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

class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {flag} = this.props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag)
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(isShowLoad) {
        const {onloadFavoriteData} = this.props;
        onloadFavoriteData(this.storeName, isShowLoad)

    }

    _store() {
        const {favorite} = this.props;
        let store = favorite[this.storeName];
        console.log('xxxx', this.props)
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
            }
        }
        return store
    }

    renderItem(data) {
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        return <Item
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({projectModel: item, flag: this.storeName, callback}, 'DetailPage')
            }
            }
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)}
        />
    }


    render() {
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id || item.item.fullName}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={'red'}
                            colors={['red']}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tinColor={"red"}
                        />
                    }
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>)
    }
}

const mapStateTopProps = state => ({
    favorite: state.favorite
});

const mapDispatchToProps = dispatch => ({
    onloadFavoriteData: (storeName, isShowLoad) => dispatch(actions.onloadFavoriteData(storeName, isShowLoad)),
});

const FavoriteTabPage = connect(mapStateTopProps, mapDispatchToProps)(FavoriteTab);


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
