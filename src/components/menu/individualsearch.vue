<template>
    <div>
        <input v-model="query_input" placeholder="chat search" v-on:keyup.enter="elasticsearchtalk" type="text">
        <ul>
            <li v-for="(result, index) in this.query_result " v-bind:key="index ">
                <div>
                    <img class="profile-img" v-bind:src="getphoto( result.friendid, result.which ) "> {{getname(result.friendid, result.which)}}
                </div>
                <div class="time__container">
                    {{result.time}}
                </div>
                <div>
                    {{result.content}}
                </div>
            </li>
        </ul>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      query_input: '',
      query_result: []
    }
  },
  methods: {
    elasticsearchtalk: async function(event) {
      console.log(this.query_input)
      const home_url = `http://localhost:8181`
      const search_url = `/api/elastic/talk/${
        this.$store.state.activefriendid
      }/${this.query_input}`
      const url = home_url + search_url

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        result.data.sort(function(a, b) {
          return Date.parse(a.time) - Date.parse(b.time)
        })

        console.log(result)
        this.query_result = result.data
      } catch (err) {
        console.log(err)
      }
    },
    getphoto: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
          .photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friends.filter(f => f.id == id)[0].name
        return name
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';
</style>