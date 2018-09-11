<template>
  <div class="panel" v-bind:class="{active: this.$store.state.view.isActiveProfile}">
    <button v-on:click="profileopen" class="closebutton">
      <font-awesome-icon icon="times" />
    </button>
    <div class="form__container">
      <div>
        <h2 class="white-title">UPDATE YOUR PROFILE !!</h2>
        <button v-on:click="tophoto" class="basicbutton">Photo</button>
        <button v-on:click="toname" class="basicbutton">Name</button>
        <button v-on:click="toback" class="basicbutton">BackgroupPhoto</button>

        <div class="set__container" v-if="photoornameorback === 'photo'">
          <h4 class="white-title">Update your profile photo.</h4>
          <div>
            <img class="previewimg" v-bind:src='this.$store.state.myState.photourl'>
          </div>
          <div class="selectfile__container">
            <label class="basicbutton selectfile">
              <input @change="onFileChange" style="display:none" type="file" accept="image/*"> SELECT
            </label>
          </div>
          <div>
            <button v-on:click="sendProfilephoto" class="basicbutton">SET PHOTO</button>
          </div>
          <p>{{this.profilephotochosen}}</p>
          <p>{{this.setprofilemessage}}</p>
        </div>
        <div class="set__container" v-else-if="photoornameorback === 'name'">
          <div>
            <h4 class="white-title">Type in NEW NAME</h4>
            <p class="white-title">Your current name is {{this.$store.state.myState.name}}</p>
            <div>
              <input placeholder="new name" v-model="newname" type="text">
            </div>
            <button v-on:click="sendNewname" class="basicbutton">
              SET PROFILE NAME
            </button>
            <p>{{setnamemessage}}</p>
          </div>
        </div>
        <div class="set__container" v-else-if="photoornameorback === 'back'">
          <h4 class="white-title">Update your Background photo.</h4>
          <div>
            <img class="previewimg" v-bind:src='this.$store.state.myState.photourl'>
          </div>
          <div class="selectfile__container">
            <label class="basicbutton selectfile">
              <input @change="onFileChange" style="display:none" type="file" accept="image/*"> SELECT
            </label>
          </div>
          <div>
            <button v-on:click="sendProfilephoto" class="basicbutton">SET PHOTO</button>
          </div>
          <p>{{this.profilephotochosen}}</p>
          <p>{{this.setprofilemessage}}</p>
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
      loginerrmessage: '',
      friendaddmessage: '',
      friendname: '',
      profilephoto: '',
      backphoto: '',
      newname: '',
      profilephotochosen: '',
      setprofilemessage: '',
      setnamemessage: '',
      photoornameorback: 'name'
    }
  },
  methods: {
    tophoto(e) {
      this.photoornameorback = 'photo'
    },
    toname(e) {
      this.photoornameorback = 'name'
    },
    toback(e) {
      this.photoornameorback = 'back'
    },
    sendphotovalidation: function() {
      if (this.photoornameorback == 'photo') {
        return this.profilephoto != ''
      } else if (this.photoornameorback == 'back') {
        return this.backphoto != ''
      }
    },
    sendProfilephoto: function(event) {
      if (this.sendphotovalidation()) {
        const home_url = `http://localhost:8181`
        let url
        let formData = new FormData()
        if (this.photoornameorback == 'photo') {
          url = home_url + '/api/user/profile/photo'
          formData.append('image', this.profilephoto)
        } else if (this.photoornameorback == 'back') {
          url = home_url + '/api/user/profile/back'
          formData.append('image', this.backphoto)
        }

        axios
          .put(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-access-token': this.$store.state.token
            }
          })
          .then(res => {
            console.log(res.data.photourl)
            this.$toasted.show('New profile photo is set')
            this.$store.commit('setPhoto', res.data.photourl)
          })
          .catch(function() {
            console.log('FAILURE!!')
            this.$toasted.show('Fail to set')
          })
      } else {
        this.$toasted.show('New profile photo is set')
      }
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
            this.$toasted.show('New name is set!')
            this.$store.commit('setName', this.newname)
          })
          .catch(() => {
            console.log('FAILURE!!')
            this.$toasted.show('This name is not unique!')
          })
      } else {
        this.$toasted.show('Name should not be empty!')
      }
    },
    onFileChange(e) {
      if (this.photoornameorback == 'photo') {
        this.profilephoto = e.target.files[0]
        this.$toasted.show('New photo is chosen. SET IT!!')
      } else if (this.photoornameorback == 'back') {
        this.backphoto = e.target.files[0]
        this.$toasted.show('New Background photo is chosen. SET IT!!')
      }
    },

    profileopen: function(event) {
      this.$store.commit('toggleprofile')
      this.friendname = ''
      this.profilephoto = ''
      this.newname = ''
      this.profilephotochosen = ''
      this.photoornameorback = 'name'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/basic.scss';
img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>