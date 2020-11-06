import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
// import Icon from 'vue-svg-icon/Icon.vue';
// Vue.component('icon', Icon);  
// Icon.inject('music'); // the name of your svg pic

Vue.use(Vant);

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
