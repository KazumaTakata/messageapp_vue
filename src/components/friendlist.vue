<template>
  <div class="friend__container">
    <div v-on:click="click_friend_title" class="friend__title">
      <h3>friend</h3>
    </div>
    <transition name="fade">
      <template v-if="friendlistactive">
        <ul>
          <template v-if="this.$store.state.friends.length != 0">
            <li v-on:click="friendchosen" v-bind:id="index" v-for="(friend, index) in getfriendlist" :key="friend.id">
              <router-link v-bind:to="  nextroute( 'individual' )" v-bind:id="index">
                <div class="friend__list__container">
                  <img class="profile-img" v-bind:src="friend.photourl">
                  <div class="list__name">
                    {{friend.name}}
                  </div>
                </div>
              </router-link>
            </li>
          </template>
          <template v-else>
            <li>
              You have no friend. Please find your friend.
            </li>
          </template>
        </ul>
      </template>
    </transition>
    <div v-on:click="click_group_title" class="friend__title">
      <h3>Group</h3>
      <button v-on:click="creategroup" class="addfriendbutton">
        <font-awesome-icon icon="plus" />
      </button>
    </div>
    <transition name="fade">
      <template v-if="grouplistactive">
        <ul>
          <template v-if="this.$store.state.groups.length != 0">
            <li v-on:click="groupchosen" v-bind:id="index" v-for="(group, index) in getgrouplist" :key="index">
              <router-link v-bind:id="index" v-bind:to="  nextroute( 'group' )">
                <div class="list__container">
                  <div class="list__name">
                    {{group.groupname}}
                  </div>
                </div>
              </router-link>
            </li>
          </template>
          <template v-else>
            <li>
              You belong to no group. Please participate in a group.
            </li>
          </template>
        </ul>
      </template>
    </transition>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'FriendList',
  data() {
    return {
      friendlistactive: false,
      grouplistactive: false
    }
  },
  computed: {
    getfriendlist: function() {
      if (this.$store.state.friends.length == 0) {
      } else {
        return this.$store.state.friends
      }
    },
    getgrouplist: function() {
      if (this.$store.state.groups.length == 0) {
      } else {
        return this.$store.state.groups
      }
    }
  },
  methods: {
    click_friend_title: function() {
      this.friendlistactive = !this.friendlistactive
    },
    click_group_title: function() {
      this.grouplistactive = !this.grouplistactive
    },
    nextroute: function(next) {
      let currentroute = this.$router.currentRoute
      let nextpath = '/' + currentroute.fullPath.split('/')[1] + '/' + next
      return nextpath
    },
    creategroup: function() {
      this.$store.commit('toggleGroup')
    },
    friendchosen: async function(event) {
      this.$store.commit('setindividualorgroup', 'individual')
      this.$store.commit(
        'setactivefriendid',
        this.$store.getters.getfriend(event.target.id).id
      )
      const home_url = `http://localhost:8181`
      const talk_url =
        '/api/user/talks/' + this.$store.getters.getfriend(event.target.id).id
      const url = home_url + talk_url

      let result = await axios({
        method: 'get',
        url: url,
        headers: { 'x-access-token': this.$store.state.token }
      })

      this.$store.commit('settalks', result.data)
      this.$store.commit(
        'setactivename',
        this.$store.getters.getfriend(event.target.id).name
      )
    },
    groupchosen: async function(event) {
      this.$store.commit('setindividualorgroup', 'group')

      this.$store.commit(
        'setactivegroup',
        this.$store.state.groups[event.target.id]._id
      )

      this.$store.commit(
        'setactivegroupname',
        this.$store.state.groups[event.target.id].groupname
      )

      const home_url = `http://localhost:8181`
      const grouptalk_url =
        '/api/group/talk/' + this.$store.state.groups[event.target.id]._id
      const url = home_url + grouptalk_url

      let result = await axios({
        method: 'get',
        url: url,
        headers: { 'x-access-token': this.$store.state.token }
      })

      this.$store.commit('setgrouptalks', result.data)
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

a {
  text-decoration: none;
  color: $font-color;
  font-weight: 500;
}
.addfriendbutton {
  font-size: 1rem;
  color: white;
  background: none;
  outline: none;
  border: none;
  transition: 0.4s;
}

.addfriendbutton:hover {
  transform: rotate(45deg);
}

.friend__container {
  padding-top: 50px;
  color: white;
  width: 210px;
}

.friend__title {
  justify-content: center;
  display: flex;
  border-bottom: 1px solid white;
}

.profile-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}
ul {
  list-style: none;
  padding: 0px 0px;
  color: white;
}
li {
  padding: 10px 30px;
  width: 150px;
  border-bottom: 1px solid $border-color;
  color: white;
}

li:hover {
  background: $sidebar-background;
  color: white;
}

li * {
  pointer-events: none;
}

.list__container {
  display: flex;
  justify-content: center;
}

.friend__list__container {
  display: flex;
}

.list__name {
  line-height: 40px;
  margin-left: 10px;
  text-align: center;
  color: white;
}
</style>
