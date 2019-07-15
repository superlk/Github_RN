/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TextInput, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';

import action from '../action/index';

type Props = {};
const KEY="save_key";
export default class AsyncStorageDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
    }

    doSave() {
        AsyncStorage.setItem(KEY,this.value,error => {
            error && console.log(error.toString())
        })

    }

    doRemove() {
        AsyncStorage.removeItem(KEY,error => {
            error && console.log(error.toString())
        })

    }

    getData() {
        AsyncStorage.getItem(KEY,(error,value)=>{
            this.setState({
                showText:value
            });
            error && console.log(error.toString())
        })

    }


    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorageDemoPage 使用</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.value = text;
                    }}
                />
                <View style={styles.input_container}>
                    <Text onPress={() => {
                        this.doSave();
                    }}>
                        存储
                    </Text>
                    <Text onPress={() => {
                        this.doRemove();
                    }}>
                        删除
                    </Text>
                    <Text onPress={() => {
                        this.getData();
                    }}>
                        获取
                    </Text>

                </View>
                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
    input: {
        height: 30,
        // flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around'
    }
});

// const mapStateToProps=state=>({});
// const mapDispatchToProps=dispatch=>({
//   onThemeChange:theme=>dispatch(action.onThemeChange(theme))
// });
//
// export default  connect(mapStateToProps,mapDispatchToProps)(FetchDemoPage)
