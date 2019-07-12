/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import action from '../action/index';

type Props = {};
  class FavoritePage extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoritePage</Text>
        <Button title={'改变主题颜色'}
                onPress={() => {
                  // navigation.setParams({
                  //   theme: {
                  //     tintColor: 'green',
                  //     updateTime: new Date().getTime()
                  //   }
                  // })
                  this.props.onThemeChange("#206")
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

const mapStateToProps=state=>({});
const mapDispatchToProps=dispatch=>({
  onThemeChange:theme=>dispatch(action.onThemeChange(theme))
});

export default  connect(mapStateToProps,mapDispatchToProps)(FavoritePage)
