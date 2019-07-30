import Types from "../types";
import DataStore, {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {_projectModels, handleData} from '../ActionUtil';

/**
 * hu获取最热数据的一步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onloadPopularData(storeName, url, pageSize, favoriteDao) {

    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular) // 异步action与数据流
            .then(data => {
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
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
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return dispatch => {
        setTimeout(() => { //模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) { //已经加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex, // -1
                    // projectModes:dataArray
                })
            } else {
                // 本次载入的最大数据量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data
                    })
                })

            }

        }, 500)
    }
}

