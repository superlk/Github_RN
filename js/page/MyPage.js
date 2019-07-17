/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";

type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
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
