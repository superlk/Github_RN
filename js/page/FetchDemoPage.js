/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TextInput} from 'react-native';
import {connect} from 'react-redux';

import action from '../action/index';

type Props = {};
export default class FetchDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
    }

    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
        fetch(url)
            .then(response => response.text())
            .then(responseText => {
                this.setState({
                    showText: responseText
                })
            })
    }

    loadData2() {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
        fetch(url)
            .then(response => {
                if (response.ok){
                    return response.text()
                }
                throw new Error("Network response was not ok")
            })
            .then(responseText => {
                this.setState({
                    showText: responseText
                })
            })
            .catch(e=>{
                this.setState({
                    showText:e
                })
            })
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Fetch 使用</Text>
                <View style={styles.input_container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.searchKey = text;
                        }}
                    />
                    <Button title="获取"
                            onPress={() => {
                                this.loadData();
                            }}/>
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
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

// const mapStateToProps=state=>({});
// const mapDispatchToProps=dispatch=>({
//   onThemeChange:theme=>dispatch(action.onThemeChange(theme))
// });
//
// export default  connect(mapStateToProps,mapDispatchToProps)(FetchDemoPage)
