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
          <input class="basicbutton" type="submit" value="SUBMIT" v-on:click="loginsubmit">
        </div>
      </form>
      <div>
        <a href="/auth/github"><img src="http://localhost:8181/icon/github.svg" alt="Kiwi standing on oval "> SIGNUP/LOGIN with GITHUB</a>
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
</style>