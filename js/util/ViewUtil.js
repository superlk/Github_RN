import React from 'react'
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {

    /**
     * 获取设置页面的item
     * @param callBack 单击item回调
     * @param text 显示的文本
     * @param color 图标颜色
     * @param Icons react-native-vector-icons组件
     * @param icon 左侧图标
     * @param expandableIco  右侧图标
     */
    static getSetingItem(callBack, text, color, Icons, icon, expandableIco) {
        return (
            <TouchableOpacity
                onPress={callBack}
                style={styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Ionicons && icon ?
                        <Icons
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}
                        /> :
                        <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        // alignItems: 'center',
                        color: color || 'black',
                    }}
                />

            </TouchableOpacity>
        )
    }


    static getMenuItem(callBack, menu, color, expandableIco) {
        return ViewUtil.getSetingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }

    /**
     * 获取左侧按钮
     * @param callBack
     * @returns {*}
     */
    static getLifeBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}/>
        </TouchableOpacity>
    }

    /**
     * 获取分享按钮
     */
    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}>
            <Ionicons
                name={'md-share'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}
            />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        // justifyContent: 'space-between',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});
