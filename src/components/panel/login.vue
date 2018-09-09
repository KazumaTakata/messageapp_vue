<template>
  <div class="panel" v-bind:class="{active:  this.$store.state.view.isActiveLogin}">
    <div class="form__container">
      <h1 class="white-title">Messanger</h1>
      <button v-on:click="tosignup" class="basicbutton">SIGNUP</button>
      <button v-on:click="tologin" class="basicbutton">LOGIN</button>
      <div v-if="loginorsignup">
        <h2 class="white-title">SIGNUP</h2>
      </div>
      <div v-else>
        <h2 class="white-title">LOGIN</h2>
      </div>

      <form action="" onsubmit="event.preventDefault();">
        <input v-model="username" type="text" placeholder="name">
        <input v-model="userpassword" type="password" placeholder="password">
        <p class="errormessage">{{loginerrmessage}}</p>
        <div>
          <button class="basicbutton" v-on:click="loginsubmit">
            SUBMIT
          </button>
        </div>
      </form>
      <div class="margin50">
        <a class="basicbutton" href="/auth/github">
          <svg aria-labelledby="simpleicons-github-icon" y="30" width="25" height="25" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="githubicon">
            <title id="simpleicons-github-icon">GitHub icon</title>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          SIGNUP/LOGIN with GITHUB</a>
      </div>

    </div>
  </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      username: '',
      userpassword: '',
      loginerrmessage: '',
      loginorsignup: true
    }
  },
  methods: {
    tologin(e) {
      this.loginorsignup = false
    },
    tosignup(e) {
      this.loginorsignup = true
    },
    preparedata: async function(token, mystate) {
      this.$store.commit('togglelogin')
      this.$store.commit('settoken', token)
      this.$store.commit('setmyState', mystate)

      try {
        let result2 = await axios({
          method: 'get',
          url: `http://localhost:8181/api/friend`,
          headers: { 'x-access-token': token }
        })

        for (let i = 0; i < result2.data.length; i++) {
          result2.data[i].login = false
        }

        this.$store.commit('setfriend', result2.data)

        let result5 = await axios({
          method: 'get',
          url: `http://localhost:8181/api/group`,
          headers: { 'x-access-token': token }
        })

        this.$store.commit('setgroup', result5.data)

        this.$router.push('chat')
      } catch (err) {
        console.log(err)
      }

      this.$store.state.websocket_video.send(
        JSON.stringify({ pingid: mystate.id })
      )

      this.$store.state.websocket_chat.send(
        JSON.stringify({ type: 'ping', myId: token })
      )
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

        this.preparedata(result.data.token, result.data)
      } catch (err) {
        console.log(err)
        this.loginerrmessage =
          'Your name is already used or your password is not correct'
      }
    }
  },
  mounted: async function() {
    let jwt = localStorage.getItem('JWT')

    if (jwt != null) {
      localStorage.clear()
      let result = await axios({
        method: 'get',
        url: `http://localhost:8181/api/user/myState/`,
        headers: { 'x-access-token': jwt }
      })
      result.data.token = jwt

      this.preparedata(jwt, result.data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/basic.scss';

a {
  line-height: 10px;
  position: relative;

  img {
    position: relative;
    top: 10px;
    vertical-align: center;
  }
}

#githubicon {
  position: relative;
  top: 5px;
  fill: white;
}
</style>