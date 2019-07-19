import Types from "../types";
import DataStore from "../../expand/dao/DataStore";

/**
 * hu获取最热数据的一步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onloadPopularData(storeName, url,pageSize) {

    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) // 异步action与数据流
            .then(data => {
                handleData(dispatch, storeName, data,pageSize)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param callBack
 */
export  function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray=[],callBack) {
    return dispatch=>{
        setTimeout(()=>{ //模拟网络请求
            if ((pageIndex-1)*pageSize>=dataArray.length){ //已经加载完全部数据
                if(typeof  callBack==='function'){
                    callBack('no more')
                }
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName:storeName,
                    pageIndex:--pageIndex, // -1
                    projectModes:dataArray
                })
            }else {
                // 本次载入的最大数据量
                let max=pageSize * pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes:dataArray.slice(0,max)
                })
            }

        },500)
    }
}

/**
 * 处理下拉刷新数据
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
function handleData(dispatch, storeName, data,pageSize) {
    let fixItems = [];
    if (data && data.data && data.data.items) {
        fixItems = data.data.items
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        projectModes:pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize), // 第一次要加载的数控
        items: fixItems,
        storeName,
        pageIndex: 1
    })

}
