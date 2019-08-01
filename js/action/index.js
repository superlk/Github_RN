import {onThemeChange} from "./theme";
import {onloadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular'
import {onloadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} from './trending';
import {onloadFavoriteData,} from './favorite';

export default {
    onThemeChange,
    onloadPopularData,
    onLoadMorePopular,
    onloadTrendingData,
    onLoadMoreTrending,
    onloadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
}
