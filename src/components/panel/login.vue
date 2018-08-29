<template>
  <div class="panel" v-bind:class="{active:  this.$store.state.isActiveLogin}">
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
        this.$store.commit('togglelogin')
        this.$store.commit('settoken', result.data.token)
        this.$store.commit('setmyState', result.data)

        this.$store.state.websocket_video.send(
          JSON.stringify({ pingid: result.data.id })
        )

        // this.$store.state.websocket_chat.send(
        //   JSON.stringify({ pingid: result.data.id })
        // )
        this.$store.state.websocket_chat.send(
          JSON.stringify({ ping: 'hey', myId: this.$store.state.token })
        )

        try {
          let result2 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/friend`,
            headers: { 'x-access-token': result.data.token }
          })

          this.$store.commit('setfriend', result2.data)

          let result5 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/group`,
            headers: { 'x-access-token': result.data.token }
          })

          this.$store.commit('setgroup', result5.data)

          this.$router.push('chat')
        } catch (err) {
          console.log(err)
        }

        try {
          let result3 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/group`,
            headers: { 'x-access-token': result.data.token }
          })

          this.$store.commit('setgroup', result3.data)
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
        this.loginerrmessage =
          'Your name is already used or your password is not correct'
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