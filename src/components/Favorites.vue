<template>
  <div>
    <carousel
      v-if="pages.length"
      :pages="pages"
      :pause="pause"
      :startV="startedFavorites[0]"
      :startH="startedFavorites[1]"
      :admob="admob"
      @updateH="updatedH"
      @updateV="updatedV"
      download="Cache"
    />
    <div
      v-else
      class="fixed-center full-width text-h5 text-center text-white"
    >
      {{msg}}
    </div>
  </div>
</template>

<script>
import Carousel from 'components/Carousel.vue'

export default {
  name: 'Recommended',
  components: {
    Carousel
  },
  props: {
    pause: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      msg: 'Carregando...',
      following: [],
      startedFavorites: [0, 0],
      admob: false,
      account: {
        pro: 0
      }
    }
  },
  computed: {
    pages: function () {
      return this.$store.state.pages.favorites
    }
  },
  created () {
    this.startedFavorites = this.$store.state.pages.startedFavorites

    if (this.$store.state.pages.show) {
      this.$emit('toggleMenu')
      this.msg = 'Você ainda não segue nenhuma página.'
    } else if (localStorage.getItem('account')) {
      this.account = this.$storage.getObj('account')
      if (this.account.following.length) {
        this.following = this.account.following.map(f => f.page)
      } else {
        this.$emit('toggleMenu')
        this.msg = 'Você ainda não segue nenhuma página.'
      }
    } else if (localStorage.getItem('following')) {
      this.following = this.$storage.getObj('following').map(f => f.page)
      if (!this.following.length) {
        this.$emit('toggleMenu')
        this.msg = 'Você ainda não segue nenhuma página.'
      }
    } else {
      this.$emit('toggleMenu')
      this.msg = 'Você ainda não segue nenhuma página.'
    }
  },
  methods: {
    getPages: function (pagination) {
      this.$axios.get(`favorites/6/6/${pagination}/${this.following.join(',')}`)
        .then(response => {
          const pages = response.data.data

          if (pages.length) {
            this.$store.commit('pages/pushFavorites', pages)
          }
        })
    },
    getPosts: function (index, pagination) {
      this.$axios.get(`page/${this.pages[index].id}/posts/6/${pagination}`)
        .then(response => {
          const posts = response.data.data

          if (posts.length) {
            this.$store.commit('pages/pushFavoritesPosts', posts)
          }
        })
    },
    updatedH: function (ret) {
      if (this.pages[ret.v].posts.length % 6 === 0 && ret.h === this.pages[ret.v].posts.length - 4) {
        this.getPosts(ret.v, this.pages[ret.v].posts.length / 6)
      }

      this.showAd()

      this.$store.commit('pages/setStartedFavorites', [ret.v, ret.h])
    },
    updatedV: function (ret) {
      if (this.pages.length % 6 === 0 && ret.v === this.pages.length - 4) {
        this.getPages(this.pages.length / 6)
      }

      this.showAd()

      this.$store.commit('pages/setStartedFavorites', [ret.v, ret.h])
    },
    showAd: function () {
      this.$store.commit('pages/setcounterAd')
      if (!this.account.pro && this.$store.state.pages.counterAd === this.$store.state.pages.ads) {
        window.admob.interstitial.load({
          id: {
            android: 'ca-app-pub-7877878592385970/1810585249',
            ios: 'ca-app-pub-7877878592385970/1810585249'
          }
        }).then(() => {
          window.admob.interstitial.show()
          this.admob = true

          setTimeout(() => {
            this.admob = false
          }, 5000)
        })

        this.$store.commit('pages/setAds')
      }
    }
  }
}
</script>
