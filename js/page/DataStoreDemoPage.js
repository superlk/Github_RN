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
import DataStore from '../expand/dao/DataStore';


type Props = {};
const KEY = "save_key";
export default class DataStoreDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        };
        this.dataStore = new DataStore()
    }

    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.value}`;
        this.dataStore.fetchData(url)
            .then(data => {
                let showData = `初次数据加载数据:${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
                this.setState({
                    showText: showData
                })
            })
            .catch(error => {
                error && console.log(error.toString())
            })
    }


    render() {
        const {navigation} = this.props;
        console.log("====",this.state.showText)
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>离线缓存框架设计</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.value = text;
                    }}
                />
                <View style={styles.input_container}>
                    <Text onPress={() => {
                        this.loadData();
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
        justifyContent: 'space-around'
    }
});

// const mapStateToProps=state=>({});
// const mapDispatchToProps=dispatch=>({
//   onThemeChange:theme=>dispatch(action.onThemeChange(theme))
// });
//
// export default  connect(mapStateToProps,mapDispatchToProps)(FetchDemoPage)
