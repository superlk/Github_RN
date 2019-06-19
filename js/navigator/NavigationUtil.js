// 全局导航控制类
export default class NavigationUtil {
    /**
     * 返回上一页
     * @param params
     */
    static  resetGoBack(params){
        const {navigation}=params;
        navigation.goBack()
    }
    /**
     * 重置到首页
     */
    static  resetToHomePage(params){
        const {navigation}=params;
        navigation.navigate("Main")
    }

}
