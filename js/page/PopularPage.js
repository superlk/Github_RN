/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil';
import DetailPage from "./DetailPage";

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props){
        super(props);
        this.tabNames=['Java','Android','IOS','React','React Native','Python']
    }

    // 动态获取tab数据
    genTabs(){
        const tabs={};
        this.tabNames.forEach((item,index)=>{
            tabs[`tab${index}`]={
                screen:props=><PopularTab {...props} tabLabel={item}/>, //传数据
                // screen:PopularTab,
                navigationOptions:{
                    title:item
                }
            }
        });
        return tabs
    }
    render() {
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
            this.genTabs(),{
                tabBarOptions:{
                    tabStyle:styles.tabStyle ,//样式
                    upperCaseLabel:false ,// 是否使标签大写，默认是true
                    scrollEnabled:true,// 是否支持滚动，默认是false
                    style:{
                        backgroundColor:'#678' // 背景色
                    },
                    indicatorStyle:styles.indicatorStyle, //标签指示器的样式
                    labelStyle:styles.labelStyle,//字体样式

                }
            }
        );

        const Top = createAppContainer(TopNavigator);
        return (
            <View style={{flex: 1, marginTop: 40}}>
                <Top/>

            </View>
        );
    }
}

class PopularTab extends Component<Props> {
    render() {
        const {tabLabel} = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>{tabLabel}</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, "DetailPage")
                }}>跳转到详情</Text>
            </View>)
    }
}


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
    tabStyle:{
        minWidth:50
    },
    indicatorStyle:{
        height:2,
        backgroundColor:'white'
    },
    labelStyle:{
        fontSize: 13,
    }
});
