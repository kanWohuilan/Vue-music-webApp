import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'

// 创建数据结构 state => getters(映射state数据) => mutations(根据提交的数据设置state数据的修改方法，)
// 修改数据状态 actions(在组件里提交数据，根据提交的数据并提交到mutations) => mutations => state
// 获取数据状态 getters(在组件computed中注册getters里映射的state数据)
Vue.use(Vuex)

 const store =  new Vuex.Store({
  state,
  getters,
  mutations,
  actions
  
  
  
})
export default store