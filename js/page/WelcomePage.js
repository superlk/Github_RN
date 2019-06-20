/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUitl from '../navigator/NavigationUtil'


type Props = {};
export default class WelcomePage extends Component<Props> {
    constructor(props) {
        super(props)
        console.disableYellowBox = true //去除警告
    }

    componentDidMount() {
        this.timer = setTimeout(() => { //停留两秒跳转主页
            // const {navigation} = this.props;
            // navigation.navigate("Main")
            NavigationUitl.resetToHomePage({
                navigation:this.props.navigation
            })

        }, 200)
    }

    componentWillMount() {  //时间没到的时候关闭组件，导致泄露，所有需要关闭time
        this.timer && clearTimeout(this.timer)
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>WelcomePage</Text>
            </View>
        );
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
});
