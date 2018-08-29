<template>
  <div>
    <div class="panel" v-bind:class="{active: this.$store.state.isActiveAddfriend}">
      <button v-on:click="searchopen" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>

      <div class="form__container">
        <div>
          <button v-on:click="toFriend" class="basicbutton">Friend</button>
          <button v-on:click="toGroup" class="basicbutton">Group</button>
        </div>
        <template v-if="friendorgroup">
          <h2>Find Your Friend!!</h2>
          <div>
            <input v-model="friendname" placeholder="name" type="text">
            <button v-on:click="findfriend" class="searchbutton">
              <font-awesome-icon icon="search" />
            </button>
            <p>{{nofindmessage}}</p>
          </div>
          <div class="result__container">
            <div>
              <img　v-bind:src="this.searchuserphotourl" alt="">
            </div>
            <p>{{searchusername}}</p>
            <button v-on:click="addfriend" class="basicbutton">
              ADD THIS FRIEND
            </button>
            <p>{{friendaddmessage}}</p>
          </div>
        </template>
        <template v-else>
          <h2>Find Group!!</h2>
          <div>
            <input v-model="friendname" placeholder="name" type="text">
            <button v-on:click="findfriend" class="searchbutton">
              <font-awesome-icon icon="search" />
            </button>
            <p>{{nofindmessage}}</p>
          </div>
          <div class="result__container">
            <p>{{searchusername}}</p>
            <button v-on:click="addfriend" class="basicbutton">
              Join this group
            </button>
            <p>{{friendaddmessage}}</p>
          </div>
        </template>

      </div>

    </div>

  </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      friendaddmessage: '',
      friendname: '',
      searchusername: '',
      searchuserid: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      previewimageurl: this.$store.state,
      profilephoto: '',
      friendorgroup: true
    }
  },

  methods: {
    toGroup() {
      this.friendorgroup = false
    },
    toFriend() {
      this.friendorgroup = true
    },
    searchopen(e) {
      this.$store.commit('toggleaddfriend')
    },
    addfriend: async function(event) {
      if (this.searchuserid != '') {
        const home_url = `http://localhost:8181`
        const login_url = '/api/friend/add/' + this.searchuserid
        const url = home_url + login_url

        try {
          let result = await axios({
            method: 'get',
            url: url,
            headers: { 'x-access-token': this.$store.state.token }
          })
          this.friendaddmessage = 'New friend added !!'
          try {
            let result2 = await axios({
              method: 'get',
              url: `http://localhost:8181/api/friend`,
              headers: { 'x-access-token': this.$store.state.token }
            })

            this.$store.commit('setfriend', result2.data)
          } catch (err) {
            console.log(err)
          }
        } catch (err) {
          console.log(err)
          this.friendaddmessage = 'This person is aleady yor friend'
        }
      } else {
        this.friendaddmessage = 'Please find friend by name first!!'
      }
    },
    findfriend: async function(event) {
      if (this.friendname != this.$store.state.myState.name) {
        const home_url = `http://localhost:8181`
        const login_url = '/api/friend/' + this.friendname
        const url = home_url + login_url
        try {
          let result = await axios({
            method: 'get',
            url: url,
            headers: { 'x-access-token': this.$store.state.token }
          })
          if (result.data.name != undefined) {
            this.searchuserid = result.data.id
            this.searchusername = result.data.name
            this.searchuserphotourl = result.data.photourl
            this.nofindmessage = ''
          } else {
            this.nofindmessage = 'No friend found !!'
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        this.nofindmessage = 'This is your name'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
</style>