<template>
  <ul v-if="!isLoading">
    <li v-on:click="friendchosen" v-bind:id="index" v-for="(friend, index) in friends" :key="friend.id">
      <div class="list__container">
        <img v-bind:src="friend.photourl">
        <div class="list__name">
          {{friend.name}}
        </div>
      </div>
    </li>
  </ul>
  <ul v-else>
    <li>
      Loading...
    </li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FriendList',
  data() {
    return {
      isLoading: true,
      friends: []
    }
  },
  methods: {
    loadfrienddata: async function() {
      const home_url = `http://localhost:8181`
      const url = home_url + '/api/friend'

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        this.friends = result.data
        this.isLoading = false
      } catch (err) {}
    },
    friendchosen: async function(event) {
      console.log(this.friends[event.target.id].id)
      this.$store.commit('setactivefriendid', this.friends[event.target.id].id)
      const home_url = `http://localhost:8181`
      const talk_url = '/api/user/talks/' + this.friends[event.target.id].id
      const url = home_url + talk_url

      let result = await axios({
        method: 'get',
        url: url,
        headers: { 'x-access-token': this.$store.state.token }
      })

      this.$store.commit('settalks', result.data)
      this.$store.commit('setactivename', this.friends[event.target.id].name)

      console.log(result)
    }
  },
  created() {
    this.loadfrienddata()
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
img {
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
