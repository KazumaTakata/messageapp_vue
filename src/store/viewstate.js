const module = {
  state: {
    isActiveAddfriend: false,
    isActiveLogin: true,
    isActiveProfile: false,
    isActiveNotification: false,
    isActiveCreateGroup: false,
    isActiveChatmenu: true,
  },
  mutations: {
    toggleaddfriend(state) {
      state.isActiveAddfriend = !state.isActiveAddfriend;
    },
    togglelogin(state) {
      state.isActiveLogin = !state.isActiveLogin;
    },
    toggleprofile(state) {
      state.isActiveProfile = !state.isActiveProfile;
    },
    toggleGroup(state) {
      state.isActiveCreateGroup = !state.isActiveCreateGroup;
    },
    togglenotification(state) {
      state.isActiveNotification = !state.isActiveNotification;
    },
    togglechatmenu(state) {
      state.isActiveChatmenu = !state.isActiveChatmenu;
    },
  },
};

export default module;
