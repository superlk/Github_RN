import Types from "../types";
import DataStore, {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {handleData} from '../ActionUtil';
/**
 * hu获取最热数据的一步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onloadTrendingData(storeName, url,pageSize) {

    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending) // 异步action与数据流
            .then(data => {
                handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch, storeName, data,pageSize)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.TRENDING_REFRESH_FAIL,
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
export  function onLoadMoreTrending(storeName,pageIndex,pageSize,dataArray=[],callBack) {
    return dispatch=>{
        setTimeout(()=>{ //模拟网络请求
            if ((pageIndex-1)*pageSize>=dataArray.length){ //已经加载完全部数据
                if(typeof  callBack==='function'){
                    callBack('no more')
                }
                dispatch({
                    type:Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName:storeName,
                    pageIndex:--pageIndex, // -1
                    projectModes:dataArray
                })
            }else {
                // 本次载入的最大数据量
                let max=pageSize * pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                dispatch({
                    type:Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes:dataArray.slice(0,max)
                })
            }

        },500)
    }
}

