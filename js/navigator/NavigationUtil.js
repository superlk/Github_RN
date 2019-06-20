// 全局导航控制类
export default class NavigationUtil {
    /**
     * 返回到指定页面
     * @param params
     */
    static goPage(params, page) {
        // console.log(">>>",NavigationUtil.navigation)
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log("NavigationUtil.navigation can not be null");
            return
        }
        navigation.navigate(page, {...params})
    }

    /**
     * 返回上一页
     * @param params
     */
    static goBack(navigation) {
        navigation.goBack()
    }

    /**
     * 重置到首页
     */
    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate("Main")
    }

}
