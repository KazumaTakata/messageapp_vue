import Vue from "vue";
import Router from "vue-router";
import Chat from "../components/chat.vue";
import GroupChat from "../components/chat/groupchat.vue";
import IndividualChat from "../components/chat/individualchat.vue";
import Feed from "../components/feed.vue";
import Video from "../components/video.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/chat",
      component: Chat,
      children: [
        {
          path: "individual",
          component: IndividualChat,
        },
        {
          path: "group",
          component: GroupChat,
        },
      ],
    },
    {
      path: "/video",
      component: Video,
    },
    {
      path: "/feed",
      component: Feed,
    },
  ],
});
