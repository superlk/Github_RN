import React, {Component} from 'react';
import {ViewPropTypes, View, StatusBar, Text, StyleSheet, Platform} from 'react-native';
import PropTypes from 'prop-types';


const NAV_BAR_HEIGET_IOS = 44;// 导航栏在IOS的高度
const NAV_BAR_HEIGET_ANDROID = 50;// 导航栏在Android的高度
const STATUS_BAR_HEIGET = 20;// 导航栏的高度

const statusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default',]),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string
};

export default class NavigationBar extends Component {
    // 类型检测
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(statusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    };
    // 设置默认属性
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false
        }
    };

    render() {
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar}/>
            </View> : null;
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title} </Text>;
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>;
        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }

    getButtonElement(data) {
        return (
            <View style={styles.naBarButton}>
                {data ? data : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1296f3'
    },
    naBarButton: {
        alignItems: 'center'
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === "IOS" ? NAV_BAR_HEIGET_IOS : NAV_BAR_HEIGET_ANDROID
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',//绝对布局
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
    },
    title: {
        fontSize: 20,
        color: "white",
    },
    statusBar: {
        height: Platform.OS === "IOS" ? STATUS_BAR_HEIGET : 0
    }
});
