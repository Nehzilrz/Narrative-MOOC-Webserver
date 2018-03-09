import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import Eagle from 'eagle.js'
import EntityLink from './component/EntityLink.vue';
import FollowUpQuestion from './component/FollowUpQuestion.vue';
import scrollReveal from "./lib/scrollReveal.js";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import 'eagle.js/dist/eagle.css'
import 'plottable/plottable.css'

Vue.prototype.$sr = scrollReveal({ reset: true });
Vue.use(Eagle)
Vue.use(BootstrapVue)
Vue.component('entity-link', EntityLink);
Vue.component('follow-up', FollowUpQuestion);

new Vue({
  el: '#app',
  render: h => h(App)
})
