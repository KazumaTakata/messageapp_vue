<template>
  <div>
    <button v-bind:class="{active: sidebarActive}" v-on:click="sidebaropen" id='menu_button'>
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
          <button v-on:click="addfriend" class="skelltonbutton">
            ADD THIS FRIEND
          </button>
          <p>{{friendaddmessage}}</p>
        </div>
      </div>
    </div>

    <div class="panel" v-bind:class="{active: isActiveProfile}">
      <button v-on:click="profileopen" class="closebutton">
        <font-awesome-icon icon="times" />
      </button>
      <div class="form__container">
        <div>
          <h1>UPDATE YOUR PROFILE !!</h1>
          <div>
            <img class="previewimg" v-bind:src='this.$store.state.myState.photourl'>
          </div>

          <div class="selectfile__container">
            <label class="skelltonbutton selectfile">
              <input @change="onFileChange" style="display:none" type="file" accept="image/*"> SELECT NEW PROFILE PHOTO
            </label>
          </div>
          <p>{{this.profilephotochosen}}</p>

          <div>
            <button v-on:click="sendProfilephoto" class="skelltonbutton">SET PHOTO</button>
          </div>
          <p>{{this.setprofilemessage}}</p>

        </div>
        <div>
          <h2>Type in NEW NAME</h2>
          <p>Your current name is {{this.$store.state.myState.name}}</p>
          <div>
            <input placeholder="new name" v-model="newname" type="text">
          </div>
          <button v-on:click="sendNewname" class="skelltonbutton">
            SET PROFILE NAME
          </button>
          <p>{{setnamemessage}}</p>
        </div>
      </div>
    </div>

    <div class="panel" v-bind:class="{active: isActiveLogin}">
      <div class="form__container">
        <h1>Messanger</h1>
        <button v-on:click="tosignup" class="basicbutton">SIGNUP</button>
        <button v-on:click="tologin" class="basicbutton">LOGIN</button>
        <div v-if="loginorsignup">
          <h2>SIGNUP</h2>
        </div>
        <div v-else>
          <h2>LOGIN</h2>
        </div>

        <form action="" onsubmit="event.preventDefault();">
          <input v-model="username" type="text" placeholder="name">
          <input v-model="userpassword" type="password" placeholder="password">
          <p class="errormessage">{{loginerrmessage}}</p>
          <div>
            <input class="basicbutton" type="submit" value="SUBMIT" v-on:click="loginsubmit">
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
      sidebarActive: false,
      sidebarItems: ['chat', 'video', 'feed'],
      username: '',
      userpassword: '',
      loginerrmessage: '',
      friendaddmessage: '',
      friendname: '',
      searchusername: '',
      searchuserid: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      previewimageurl: this.$store.state,
      profilephoto: '',
      newname: '',
      loginorsignup: true,
      profilephotochosen: '',
      setprofilemessage: '',
      setnamemessage: ''
    }
  },

  methods: {
    tologin(e) {
      this.loginorsignup = false
    },
    tosignup(e) {
      this.loginorsignup = true
    },
    onFileChange(e) {
      this.profilephoto = e.target.files[0]
      this.profilephotochosen = 'New photo is chosen. SET IT!!'
      // this.previewimageurl = URL.createObjectURL(this.profilephoto)
    },
    sendNewname: function(event) {
      if (this.newname != '') {
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
          .then(() => {
            console.log('SUCCESS!!')
            this.setnamemessage = 'New name is set!'
            this.$store.commit('setName', this.newname)
          })
          .catch(() => {
            console.log('FAILURE!!')
            this.setnamemessage = 'This name is not unique!'
          })
      } else {
        this.setnamemessage = 'Name should not be empty!'
      }
    },
    sendProfilephoto: function(event) {
      if (this.profilephoto != '') {
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
          .then(res => {
            console.log(res.data.photourl)
            this.setprofilemessage = 'New profile photo is set!!'
            this.$store.commit('setPhoto', res.data.photourl)
          })
          .catch(function() {
            console.log('FAILURE!!')
          })
      } else {
        this.setprofilemessage =
          'No photo is chosen. Please choose your new profile photo!'
      }
    },

    sidebaropen: function(event) {
      this.isActive = !this.isActive
      this.sidebarActive = !this.sidebarActive
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

      let LorS = this.loginorsignup ? 'signup' : 'login'
      try {
        let result = await axios.post(url, {
          name: this.username,
          password: this.userpassword,
          loginorsignup: LorS
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
          console.log(result)
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
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';

.selectfile {
  padding: 10px;
}

.selectfile:hover {
  color: red;
  border-color: red;
}

.selectfile__container {
  margin: 30px;
}

#sidebar {
  position: absolute;
  width: 210px;
  height: 100vh;
  background: $sidebar-background;
  left: 0;
  z-index: 1;
  transition: 0.4s;
}
h1 {
  font-size: 3rem;
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
  margin: 20px;
}
img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
