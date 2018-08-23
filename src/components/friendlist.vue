<template>
  <ul>
    <template v-if="this.$store.state.friends.length != 0">
      <li v-on:click="friendchosen" v-bind:id="index" v-for="(friend, index) in getfriendlist" :key="friend.id">
        <div class="list__container">
          <img class="profile-img" v-bind:src="friend.photourl">
          <div class="list__name">
            {{friend.name}}
          </div>
        </div>
      </li>
    </template>
    <template v-else>
      <li>
        You have no friend. Please find your friend.
      </li>
    </template>
  </ul>

</template>

<script>
import axios from 'axios'

export default {
  name: 'FriendList',
  data() {
    return {}
  },
  computed: {
    getfriendlist: function() {
      if (this.$store.state.friends.length == 0) {
      } else {
        return this.$store.state.friends
      }
    }
  },
  methods: {
    friendchosen: async function(event) {
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
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';

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
  margin-top: 50px;
}
li {
  padding: 10px 30px;
  width: 150px;
  border-bottom: 1px solid $border-color;
}

li:hover {
  background: $hover-color;
  color: white;
}

li * {
  pointer-events: none;
}

.list__container {
  display: flex;
}

.list__name {
  line-height: 40px;
  margin-left: 20px;
}
</style>
