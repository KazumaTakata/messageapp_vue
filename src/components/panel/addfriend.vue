<template>
  <div>
    <div class="panel" v-bind:class="{active: this.$store.state.view.isActiveAddfriend}">
      <button v-on:click="searchopen" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>
      <div>
        <h2 class="white-title">{{search_title}}</h2>
        <div>
          <input v-model="search_input" placeholder="name" type="text">
          <button v-on:click="search" class="searchbutton">
            <font-awesome-icon icon="search" />
          </button>
          <button v-on:click="toFriend" class="basicbutton">Friend</button>
          <button v-on:click="toGroup" class="basicbutton">Group</button>
          <p>{{nofindmessage}}</p>
        </div>
        <div>
          <ul>
            <li v-for="(item, index) in this.search_result" v-bind:key="index">
              <template v-if="friendorgroup">
                <div class="friend_list_container">
                  <img　class="profile_img" v-bind:src="item.photourl" alt="">
                    <div class="name__container">
                      {{item.name}}
                    </div>
                    <button v-on:click="addfriend(index)" class="basicbutton">
                      ADD
                    </button>
                </div>
              </template>
              <template v-else>
                <div class="friend_list_container">
                  <div class="name__container">
                    {{item.name}}
                  </div>
                  <div class="name__container">
                    {{item.description}}
                  </div>
                  <button v-on:click="joingroup(index)" class="basicbutton">
                    ADD
                  </button>
                </div>
              </template>
            </li>
          </ul>
        </div>
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

      search_input: '',
      groupname: '',
      searchusername: '',
      searchuserid: '',
      searchgroupid: '',
      resultgroupname: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      profilephoto: '',
      friendorgroup: true,
      search_result: [],
      search_title: 'Find Friends'
    }
  },

  methods: {
    toGroup() {
      this.friendorgroup = false
      this.friendaddmessage = ''
      this.search_result = []
      this.search_title = 'Find Group'
    },
    toFriend() {
      this.friendorgroup = true
      this.nofindmessage = ''
      this.search_result = []
      this.search_title = 'Find Friends'
    },
    searchopen(e) {
      this.$store.commit('toggleaddfriend')
      this.friendaddmessage = ''
      this.search_input = ''
      this.groupname = ''
      this.searchusername = ''
      this.searchuserid = ''
      this.searchgroupid = ''
      this.resultgroupname = ''
      this.searchuserphotourl = 'http://localhost:8181/img/defaultprofile.jpg'
      this.nofindmessage = ''
      this.profilephoto = ''
      this.friendorgroup = true
      this.search_result = []
    },

    joingroup: async function(index) {
      const home_url = `http://localhost:8181`
      const group_url = '/api/group/'
      const url = home_url + group_url

      try {
        let result = await axios({
          method: 'put',
          url: url,
          data: {
            groupid: this.search_result[index].id
          },
          headers: { 'x-access-token': this.$store.state.token }
        })
        if (result.data.err) {
          this.$toasted.show(result.data.err)
        } else {
          this.$toasted.show('You successfully entered this group.')

          let result5 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/group`,
            headers: { 'x-access-token': this.$store.state.token }
          })

          this.$store.commit('setgroup', result5.data)
        }
      } catch (err) {
        console.log(err)
        this.$toasted.show(err)
      }
    },
    addfriend: async function(index) {
      const home_url = `http://localhost:8181`
      const id_url = '/api/friend/add/' + this.search_result[index].id
      const url = home_url + id_url

      if (this.search_result[index].id != this.$store.state.myState.id) {
        try {
          let result = await axios({
            method: 'get',
            url: url,
            headers: { 'x-access-token': this.$store.state.token }
          })
          this.$toasted.show('New friend added !!')
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
          this.$toasted.show('This person is aleady your friend')
        }
      } else {
        this.$toasted.show('This is your account')
      }
    },
    search: async function(event) {
      const home_url = `http://localhost:8181`
      let find_url
      if (this.friendorgroup) {
        find_url = '/api/elastic/user/' + this.search_input
      } else {
        find_url = '/api/elastic/group/' + this.search_input
      }
      const url = home_url + find_url
      try {
        let result = await axios({
          method: 'get',
          url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        if (result.data.length != 0) {
          this.search_result = result.data
          this.nofindmessage = ''
        } else {
          if (this.friendorgroup) {
            this.nofindmessage = 'No friend found !!'
          } else {
            this.nofindmessage = 'No group found !!'
          }

          this.search_result = []
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
  
<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/basic.scss';

input[type='text'],
input[type='password'] {
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  outline: none;
  padding: 10px;
  margin: 10px;
  width: 60%;
}

.friend_list_container {
  display: flex;
  .profile_img {
    margin-left: 50px;
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid rgb(73, 53, 53);
  }
  .name__container {
    line-height: 50px;
    margin: 0 40px;
    width: 100%;
    color: white;
  }
  button {
    float: right;
  }
}
ul {
  list-style: none;
  li {
    border-bottom: 1px solid white;
    padding: 20px;
  }
}
</style>