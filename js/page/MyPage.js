/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

const THEME_COLOR = "#678";
type Props = {};
export default class MyPage extends Component<Props> {
    // render() {
    //   const {navigation} = this.props;
    //   return (
    //     <View style={styles.container}>
    //       <Text style={styles.welcome}>MyPage</Text>
    //       <Button title={'改变主题颜色'}
    //               onPress={() => {
    //                 navigation.setParams({
    //                   theme: {
    //                     tintColor: 'blue',
    //                     updateTime: new Date().getTime()
    //                   }
    //                 })
    //               }}/>
    //       <Text onPress={() => {
    //         NavigationUtil.goPage({
    //           navigation: this.props.navigation
    //         }, "DetailPage")
    //       }}>跳转到详情</Text>
    //       <Button
    //           title={"Fetch 使用"}
    //           onPress={() => {
    //             NavigationUtil.goPage({
    //               navigation: this.props.navigation
    //             }, "FetchDemoPage")
    //           }}/>
    //       <Button
    //           title={"AsyncStorage 使用"}
    //           onPress={() => {
    //             NavigationUtil.goPage({
    //               navigation: this.props.navigation
    //             }, "AsyncStorageDemoPage")
    //           }}/>
    //       <Button
    //           title={"离线缓存框架"}
    //           onPress={() => {
    //             NavigationUtil.goPage({
    //               navigation: this.props.navigation
    //             }, "DataStoreDemoPage")
    //           }}/>
    //     </View>
    //   );
    // }

    getRightButton() {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => {
                }}
            >
                <View style={{pageIndex: 5, marginRight: 8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color: 'white'}}

                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    getLeftButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: "white"}}

            />

        </TouchableOpacity>
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        };
        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                style={{backgroundColor: THEME_COLOR}}
                rightButton={this.getRightButton()}
                leftButton={this.getLeftButton()}
            />;
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text style={styles.welcome}>MyPage</Text>
                <Button title={'改变主题颜色'}
                        onPress={() => {
                            navigation.setParams({
                                theme: {
                                    tintColor: 'blue',
                                    updateTime: new Date().getTime()
                                }
                            })
                        }}/>
                <Text onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, "DetailPage")
                }}>跳转到详情</Text>
                <Button
                    title={"Fetch 使用"}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, "FetchDemoPage")
                    }}/>
                <Button
                    title={"AsyncStorage 使用"}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, "AsyncStorageDemoPage")
                    }}/>
                <Button
                    title={"离线缓存框架"}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, "DataStoreDemoPage")
                    }}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
        marginTop: 30

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
