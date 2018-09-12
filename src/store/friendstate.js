import Vue from "vue";
const module = {
  state: {
    friends: [],
    videoactivemember: [],
    groupmember: [],
    logingroupmember: [],
    groups: [],
    individualorgroup: "individual",
    activegroupid: "",
    activefriendid: "",
    acitvename: "No Friend Chosen",
    acitvegroupname: "No Group Chosen",
  },
  mutations: {
    setlogingroupmember(state, logingroupmember) {
      state.logingroupmember = logingroupmember;
    },
    addgroupmemberlogin(state, groupmemberid) {
      state.logingroupmember.push(groupmemberid);
    },
    rmgroupmemberlogout(state, groupmemberid) {
      state.logingroupmember = state.logingroupmember.filter(
        item => item != groupmemberid
      );
    },
    makefriendlogin(state, friendids) {
      for (let i = 0; i < friendids.length; i++) {
        let friend = state.friends.find(f => f.id == friendids[i]);
        friend.login = true;
      }
    },
    makefriendlogout(state, logoutuserid) {
      let friend = state.friends.find(f => f.id == logoutuserid);
      friend.login = false;
    },
    setgroup(state, group) {
      state.groups = group;
    },
    setfriend(state, friend) {
      state.friends = friend;
    },
    setactivefriendid(state, friendid) {
      state.activefriendid = friendid;
    },
    setactivegroup(state, groupid) {
      state.activegroupid = groupid;
    },
    setindividualorgroup(state, individualorgroup) {
      state.individualorgroup = individualorgroup;
    },
    setactivename(state, name) {
      state.acitvename = name;
    },
    setactivegroupname(state, groupname) {
      state.acitvegroupname = groupname;
    },
    setvideoactivemember(state, member) {
      state.videoactivemember = member;
    },
    setsetgroupmember(state, groupmember) {
      state.groupmember = groupmember;
    },
    setGroupPhoto(state, obj) {
      let group = state.groups.find(g => g._id == obj.groupid);
      Vue.set(group, "photourl", obj.photourl);
    },
    setGroupName(state, obj) {
      let group = state.groups.find(g => g._id == obj.groupid);
      Vue.set(group, "groupname", obj.name);
    },
    setGroupDescription(state, obj) {
      let group = state.groups.find(g => g._id == obj.groupid);
      Vue.set(group, "groupdescription", obj.description);
    },
    setGroupBackPhoto(state, obj) {
      let group = state.groups.find(g => g._id == obj.groupid);
      Vue.set(group, "backgroundurl", obj.backgroundurl);
    },
  },
  getters: {
    // getactivegroupname: state => {
    //   let group = state.groups.find(g => g._id == state.activegroupid);
    //   return group.groupname;
    // },
  },
};

export default module;
