<template>
    <div class="panel" v-bind:class="{active: this.$store.state.view.isActiveGroupProfile}">
        <button v-on:click="profileopen" class="closebutton">
            <font-awesome-icon icon="times" />
        </button>
        <div class="form__container">
            <div>
                <h2 class="white-title">UPDATE GROUP PROFILE</h2>
                <button v-on:click="tophoto" class="basicbutton">Photo</button>
                <button v-on:click="toname" class="basicbutton">Name</button>
                <button v-on:click="toback" class="basicbutton">BackgroupPhoto</button>
                <button v-on:click="todescription" class="basicbutton">Description</button>

                <div class="set__container" v-if="photoornameorback === 'photo'">

                    <div>
                        <img class="previewimg" v-bind:src='getprofile'>
                    </div>
                    <div class="selectfile__container">
                        <label class="basicbutton selectfile">
                            <input @change="onFileChange" style="display:none" type="file" accept="image/*"> CHOOSE NEW GROUP PHOTO
                        </label>
                    </div>

                </div>
                <div class="set__container" v-else-if="photoornameorback === 'name'">
                    <div>

                        <p class="white-title">Current Group Name {{getname}}</p>
                        <div>
                            <input placeholder="new name" v-model="newname" type="text">
                        </div>
                        <div class="margin50">
                            <button v-on:click="sendNewname" class="basicbutton">
                                SET PROFILE NAME
                            </button>
                        </div>

                    </div>
                </div>
                <div class="set__container" v-else-if="photoornameorback === 'back'">

                    <div>
                        <img class="previewimg" v-bind:src='getbackground'>
                    </div>
                    <div class="selectfile__container">
                        <label class="basicbutton selectfile">
                            <input @change="onFileChange" style="display:none" type="file" accept="image/*"> CHOOSE NEW GROUP BACKGROUND PHOTO
                        </label>
                    </div>

                </div>
                <div class="set__container" v-else-if="photoornameorback === 'description'">
                    <div>
                        <div>
                            <textarea placeholder="new description" v-model="newdescription" type="text"></textarea>
                        </div>
                        <div class="margin50">
                            <button v-on:click="sendNewdescription" class="basicbutton">
                                SET DESCRIPTION
                            </button>
                        </div>

                    </div>
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
      newdescription: '',
      setnamemessage: '',
      photoornameorback: 'name'
    }
  },
  computed: {
    getbackground() {
      if (this.$store.state.friend.individualorgroup == 'group') {
        let group = this.$store.state.friend.groups.filter(
          g => g._id == this.$store.state.friend.activegroupid
        )
        if (group[0].backgroundurl != undefined) {
          return group[0].backgroundurl
        } else {
          return 'http://localhost:8181/img/defaultbackground.jpg'
        }
      } else {
        let friend = this.$store.state.friend.friends.filter(
          f => f.id == this.$store.state.friend.activefriendid
        )
        if (friend[0].backgroundurl != undefined) {
          return friend[0].backgroundurl
        } else {
          return 'http://localhost:8181/img/defaultbackground.jpg'
        }
      }
    },
    getprofile() {
      if (this.$store.state.friend.individualorgroup == 'group') {
        let group = this.$store.state.friend.groups.filter(
          g => g._id == this.$store.state.friend.activegroupid
        )
        if (group[0].photourl != undefined) {
          return group[0].photourl
        } else {
          return 'http://localhost:8181/img/defaultprofile.jpg'
        }
      } else {
        let friend = this.$store.state.friend.friends.filter(
          f => f.id == this.$store.state.friend.activefriendid
        )
        if (friend[0].photourl != undefined) {
          return friend[0].photourl
        } else {
          return 'http://localhost:8181/img/defaultprofile.jpg'
        }
      }
    },
    getname() {
      if (!this.$store.state.view.isFeedMine) {
        if (this.$store.state.friend.individualorgroup == 'group') {
          return this.$store.getters.getactivegroupname
        } else {
          return this.$store.state.friend.acitvename
        }
      } else {
        return this.$store.state.myState.name
      }
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
    todescription() {
      this.photoornameorback = 'description'
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
        formData.append('groupid', this.$store.state.friend.activegroupid)
        if (this.photoornameorback == 'photo') {
          url = home_url + '/api/group/photo'
          formData.append('image', this.profilephoto)
        } else if (this.photoornameorback == 'back') {
          url = home_url + '/api/group/back'
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
            if (this.photoornameorback == 'photo') {
              this.$toasted.show('New Group photo is set')
              this.$store.commit('setGroupPhoto', {
                photourl: res.data.photourl,
                groupid: this.$store.state.friend.activegroupid
              })
            } else if (this.photoornameorback == 'back') {
              this.$toasted.show('New Group Background photo is set')
              this.$store.commit('setGroupBackPhoto', {
                backgroundurl: res.data.photourl,
                groupid: this.$store.state.friend.activegroupid
              })
            }
          })
          .catch(() => {
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
        const url = home_url + '/api/group/name'
        axios
          .put(
            url,
            {
              name: this.newname,
              groupid: this.$store.state.friend.activegroupid
            },
            {
              headers: {
                'x-access-token': this.$store.state.token
              }
            }
          )
          .then(() => {
            console.log('SUCCESS!!')
            this.$toasted.show('New name is set!')
            this.$store.commit('setGroupName', {
              name: this.newname,
              groupid: this.$store.state.friend.activegroupid
            })
          })
          .catch(() => {
            console.log('FAILURE!!')
            this.$toasted.show('This name is not unique!')
          })
      } else {
        this.$toasted.show('Name should not be empty!')
      }
    },
    sendNewdescription: function() {
      if (this.newdescription != '') {
        const home_url = `http://localhost:8181`
        const url = home_url + '/api/group/description'
        axios
          .put(
            url,
            {
              description: this.newdescription,
              groupid: this.$store.state.friend.activegroupid
            },
            {
              headers: {
                'x-access-token': this.$store.state.token
              }
            }
          )
          .then(() => {
            console.log('SUCCESS!!')
            this.$toasted.show('New description is set!')
            this.$store.commit('setGroupDescription', {
              description: this.newdescription,
              groupid: this.$store.state.friend.activegroupid
            })
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
        this.$toasted.show('New photo is chosen. SET IT.')
        this.sendProfilephoto()
      } else if (this.photoornameorback == 'back') {
        this.backphoto = e.target.files[0]
        this.$toasted.show('New Background photo is chosen. SET IT.')
        this.sendProfilephoto()
      }
    },
    profileopen: function(event) {
      this.$store.commit('togglegroupprofile')
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