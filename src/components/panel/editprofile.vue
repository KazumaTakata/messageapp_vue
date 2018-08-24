<template>
    <div class="panel" v-bind:class="{active: this.$store.state.isActiveProfile}">
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
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      loginerrmessage: '',
      friendaddmessage: '',
      friendname: '',
      previewimageurl: this.$store.state,
      profilephoto: '',
      newname: '',
      profilephotochosen: '',
      setprofilemessage: '',
      setnamemessage: ''
    }
  },
  methods: {
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
    onFileChange(e) {
      this.profilephoto = e.target.files[0]
      this.profilephotochosen = 'New photo is chosen. SET IT!!'
    },
    profileopen: function(event) {
      this.$store.commit('toggleprofile')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.selectfile {
  padding: 10px;
}

.selectfile:hover {
  color: red;
  border-color: red;
}
</style>