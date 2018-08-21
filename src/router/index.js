import Vue from "vue";
import Router from "vue-router";
import Chat from "../components/chat.vue";
import Video from "../components/video.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/chat",
      component: Chat,
    },
    {
      path: "/video",
      component: Video,
    },
  ],
});
