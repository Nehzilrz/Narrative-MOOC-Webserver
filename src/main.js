import Vue from 'vue';
import BootstrapVue from "bootstrap-vue";
import editor from 'vue2-medium-editor';
import Eagle from 'eagle.js';
import scrollReveal from "scrollReveal";
import EntityLink from './component/EntityLink.vue';
import FollowUpQuestion from './component/FollowUpQuestion.vue';
import StyledText from './component/StyledText.vue';
import VideoList from './component/VideoList.vue';
import TextBox from './component/TextBox.vue';
import "./css/medium-editor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'eagle.js/dist/eagle.css';
import 'plottable/plottable.css';
import App from './App.vue';

Vue.prototype.$sr = scrollReveal({ reset: true });
Vue.use(Eagle)
Vue.use(BootstrapVue)
Vue.component('medium-editor', editor);
Vue.component('styled-text', StyledText);
Vue.component('entity-link', EntityLink);
Vue.component('follow-up', FollowUpQuestion);
Vue.component('video-list', VideoList);
Vue.component('text-box', TextBox);

new Vue({
  el: '#app',
  render: h => h(App)
})
