<template>
  <div>
    <button v-on:click="sidebaropen" id='menu_button'>
      <font-awesome-icon icon="plus" />
    </button>
    <div id="sidebar" v-bind:class="{active: isActive}">
      <button v-on:click="searchopen" class="icon_button">
        <font-awesome-icon icon="search" />
      </button>
      <button v-on:click="profileopen" class="icon_button">
        <font-awesome-icon icon="user-circle" />
      </button>
      <ul>
        <li v-for="(item, index) in sidebarItems" v-bind:key="index">
          <router-link v-bind:to="item">{{item}}</router-link>
        </li>
      </ul>

    </div>
    <div class="panel" v-bind:class="{active: isActiveAddfriend}">
      <button v-on:click="searchopen" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>
      <div class="form__container">
        <h2>Type in your friend name</h2>
        <div>
          <input v-model="friendname" type="text">
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
          <p>{{friendadderror}}</p>
          <button v-on:click="addfriend" class="skelltonbutton">
            ADD THIS FRIEND
          </button>
        </div>
      </div>
    </div>

    <div class="panel" v-bind:class="{active: isActiveProfile}">
      <button v-on:click="profileopen" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>
      <div class="form__container">
        <div>
          <p>Select new profile photo</p>
          <div>
            <img class="previewimg" v-bind:src='this.$store.state.myState.photourl'>
          </div>

          <label class="skelltonbutton">
            <input @change="onFileChange" style="display:none" type="file" accept="image/*"> SELECT PROFILE PHOTO
          </label>
          <div>
            <button v-on:click="sendProfilephoto" class="skelltonbutton">SET PHOTO</button>
          </div>

        </div>
        <div>
          <p>Type in NEW NAME</p>
          <div>
            <input v-model="newname" type="text">
          </div>
          <button v-on:click="sendNewname" class="skelltonbutton">
            SET PROFILE NAME
          </button>
        </div>
      </div>
    </div>

    <div class="panel" v-bind:class="{active: isActiveLogin}">
      <div class="form__container">
        <h1>Please login or Signup</h1>
        <form action="" onsubmit="event.preventDefault();">
          <p for="">name</p>
          <input v-model="username" type="text">

          <p for="">password</p>
          <input v-model="userpassword" type="password">
          <p class="errormessage">{{loginerrmessage}}</p>
          <div>
            <input type="submit" v-on:click="loginsubmit">
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      isActive: true,
      isActiveAddfriend: false,
      isActiveProfile: false,
      isActiveLogin: true,
      sidebarItems: ['chat', 'video', 'feed'],
      username: '',
      userpassword: '',
      loginerrmessage: '',
      friendname: '',
      searchusername: '',
      searchuserid: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      friendadderror: '',
      previewimageurl: this.$store.state,
      profilephoto: '',
      newname: ''
    }
  },

  methods: {
    onFileChange(e) {
      this.profilephoto = e.target.files[0]
      this.previewimageurl = URL.createObjectURL(this.profilephoto)
    },
    sendNewname: function(event) {
      const home_url = `http://localhost:8181`
      const url = home_url + '/api/user/profile/name'
      axios
        .post(
          url,
          { name: this.newname },
          {
            headers: {
              'x-access-token': this.$store.state.token
            }
          }
        )
        .then(function() {
          console.log('SUCCESS!!')
        })
        .catch(function() {
          console.log('FAILURE!!')
        })
    },
    sendProfilephoto: function(event) {
      const home_url = `http://localhost:8181`
      const url = home_url + '/api/user/profile/photo'
      let formData = new FormData()
      formData.append('image', this.profilephoto)
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.$store.state.token
          }
        })
        .then(function() {
          console.log('SUCCESS!!')
        })
        .catch(function() {
          console.log('FAILURE!!')
        })
    },

    sidebaropen: function(event) {
      console.log('clicked')
      this.isActive = !this.isActive
    },
    searchopen: function(event) {
      this.isActiveAddfriend = !this.isActiveAddfriend
    },
    profileopen: function(event) {
      this.isActiveProfile = !this.isActiveProfile
    },

    loginsubmit: async function(event) {
      const home_url = `http://localhost:8181`
      const login_url = '/api/user/login'
      const url = home_url + login_url

      try {
        let result = await axios.post(url, {
          name: this.username,
          password: this.userpassword
        })
        this.isActiveLogin = false
        this.$store.commit('settoken', result.data.token)
        this.$store.commit('setmyState', result.data)

        try {
          let result2 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/friend`,
            headers: { 'x-access-token': result.data.token }
          })

          this.$store.commit('setfriend', result2.data)
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
        this.loginerrmessage =
          'Your name is already used or your password is not correct'
      }
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
          console.log(result)
        } catch (err) {
          console.log(err)
          this.friendadderror = 'This person is aleady yor friend'
        }
      } else {
      }
    },

    findfriend: async function(event) {
      const home_url = `http://localhost:8181`
      const login_url = '/api/friend/' + this.friendname
      const url = home_url + login_url

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        if (result.data.name != undefined) {
          this.searchuserid = result.data.id
          this.searchusername = result.data.name
          this.searchuserphotourl = result.data.photourl
        } else {
          this.nofindmessage = 'No friend found !!'
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';

#sidebar {
  position: absolute;
  width: 210px;
  height: 100vh;
  background: $sidebar-background;
  left: 0;
  z-index: 1;
  transition: 0.4s;
}

#sidebar.active {
  left: -210px;
}

ul {
  position: relative;
  top: 50px;
}

li {
  padding: 30px 0;
  color: white;
}

li:hover {
  background: $hover-color;
}

a {
  text-decoration: none;
  color: white;
}

p {
  margin: 30px;
}
img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
