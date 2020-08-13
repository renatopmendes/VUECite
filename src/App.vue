<template>
  <div id="q-app">
    <router-view v-if="online" />
    <div
      v-else
      class="fit absolute-top bg-dark"
    >
      <div class="absolute-center full-width text-white text-center">
        <q-icon
          name="wifi_off"
          style="font-size: 3em;"
        />
        <p class="q-mt-sm q-mb-md text-h6">Você está sem internet.</p>
        <q-btn
          color="white"
          text-color="black"
          icon="refresh"
          label="Atualizar"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'
const { Network, PushNotifications } = Plugins

export default {
  name: 'App',
  data: () => {
    return {
      online: navigator.onLine,
      ready: false
    }
  },
  created () {
    Network.addListener('networkStatusChange', status => {
      this.online = status.connected

      if (this.online && !this.ready) {
        this.getFavorites()
        this.getRecommended()

        if (localStorage.getItem('account')) {
          this.getNotifications()
        }

        this.ready = true
      }
    })

    if (this.online) {
      this.getFavorites()
      this.getRecommended()

      if (localStorage.getItem('account')) {
        this.getNotifications()
      }

      this.ready = true
    }

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      notification => {
        this.getFavorites()
      }
    )

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      notification => {
        this.getFavorites()
      }
    )
  },
  methods: {
    getFavorites: function () {
      this.$store.commit('pages/setStartedFavorites', [0, 0])
      this.$store.commit('pages/clearFavorites')
      if (localStorage.getItem('account')) {
        const account = this.$storage.getObj('account')
        if (account.following && account.following.length) {
          this.$axios.get(`favorites/6/6/0/${account.following.map(f => f.page).join(',')}`)
            .then(response => {
              this.$store.commit('pages/pushFavorites', response.data.data)
            })
        }
      } else if (localStorage.getItem('following')) {
        const following = this.$storage.getObj('following')
        if (following.length) {
          this.$axios.get(`favorites/6/6/0/${following.map(f => f.page).join(',')}`)
            .then(response => {
              this.$store.commit('pages/pushFavorites', response.data.data)
            })
        }
      }
    },
    getRecommended: function () {
      this.$store.commit('pages/setStartedRecommended', [0, 0])
      this.$store.commit('pages/clearRecommended')
      if (localStorage.getItem('account')) {
        const account = this.$storage.getObj('account')
        this.$axios.get(`recommended/6/6/0/${account.following.map(f => f.page).join(',')}`)
          .then(response => {
            this.$store.commit('pages/pushRecommended', response.data.data)
          })
      } else if (localStorage.getItem('following')) {
        const following = this.$storage.getObj('following')
        this.$axios.get(`recommended/6/6/0/${following.map(f => f.page).join(',')}`)
          .then(response => {
            this.$store.commit('pages/pushRecommended', response.data.data)
          })
      } else {
        this.$axios.get('recommended/6/6')
          .then(response => {
            this.$store.commit('pages/pushRecommended', response.data.data)
          })
      }
    },
    getNotifications: function () {
      this.$axios.get('notification/me')
        .then(response => {
          this.$store.commit('pages/clearNotifications')
          this.$store.commit('pages/pushNotifications', response.data.data)
        })
    }
  }
}
</script>
