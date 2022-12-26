import {
  post,
  get,
  put,
  del
} from '@/utils/request'
// 国家占比
export const getAdsDoubanCountry = () => {
  return get('/doubanApp/bigS/getAdsDoubanCountry',)
}
// 评分情况占比
export const getAdsDoubanScore = () => {
  return get('/doubanApp/bigS/getAdsDoubanScore',)
}
// 排行榜列表
export const getAdsDouban = (data) => {
  return get('/doubanApp/bigS/getAdsDouban', data)
}
// 各电影品论词云
export const getHotwords = (data = { commentId: 1 }) => {
  return get('/doubanApp/bigS/getHotwords', data)
}
// 中国电影评分走势
export const getAdsDoubanScorezg = () => {
  return get('/doubanApp/bigS/getAdsDoubanScorezg',)
}



// 评价人数占比
export const getAdsDoubanEvaluate = () => {
  return get('/doubanApp/bigS/getAdsDoubanEvaluate',)
}

// 电影类型分类
export const getAdsDoubanType = () => {
  return get('/doubanApp/bigS/getAdsDoubanType',)
}
// 各时间段的电影数量
export const getAdsDoubanYears = () => {
  return get('/doubanApp/bigS/getAdsDoubanYears',)
}
export default {
  getAdsDoubanEvaluate,
  getAdsDoubanType,
  getAdsDoubanYears,
}
