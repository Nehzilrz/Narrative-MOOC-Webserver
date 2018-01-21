import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import Eagle from 'eagle.js'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import 'eagle.js/dist/eagle.css'
import 'plottable/plottable.css'

Vue.use(Eagle)
Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  render: h => h(App)
})
