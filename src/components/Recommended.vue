<template>
  <div>
    <carousel
      v-if="pages.length"
      :pages="pages"
      :pause="pause"
      :startV="startedRecommended[0]"
      :startH="startedRecommended[1]"
      :admob="admob"
      @updateH="updatedH"
      @updateV="updatedV"
    />
    <div
      v-else
      class="fixed-center full-width text-h5 text-center text-white"
    >
      Carregando...
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
      pagination: 0,
      following: [],
      startedRecommended: [0, 0],
      admob: false,
      account: {
        pro: 0
      }
    }
  },
  computed: {
    pages: function () {
      return this.$store.state.pages.recommended
    }
  },
  created () {
    this.startedRecommended = this.$store.state.pages.startedRecommended

    if (localStorage.getItem('account')) {
      this.account = this.$storage.getObj('account')
      if (this.account.following.length) {
        this.following = this.account.following.map(f => f.page)
      }
    } else if (localStorage.getItem('following')) {
      this.following = this.$storage.getObj('following').map(f => f.page)
    }
  },
  methods: {
    getPages: function (pages, pagination) {
      this.$axios.get(`recommended/${pages}/6/${pagination}/${this.following.join(',')}`)
        .then(response => {
          const pages = response.data.data

          if (!pages.length) {
            this.pagination = 0
            this.getPages(6, this.pagination)
          } else {
            this.$store.commit('pages/pushRecommended', pages)
          }
        })
    },
    getPosts: function (index, pagination) {
      this.$axios.get(`page/${this.pages[index].id}/posts/6/${pagination}`)
        .then(response => {
          const posts = response.data.data

          if (posts.length) {
            this.$store.commit('pages/pushRecommendedPosts', posts)
          }
        })
    },
    updatedH: function (ret) {
      if (this.pages[ret.v].posts.length % 6 === 0 && ret.h === this.pages[ret.v].posts.length - 4) {
        this.getPosts(ret.v, this.pages[ret.v].posts.length / 6)
      }

      this.showAd()

      this.$store.commit('pages/setStartedRecommended', [ret.v, ret.h])
    },
    updatedV: function (ret) {
      if (ret.v === this.pages.length - 4) {
        const rest = this.pages.length % 6
        if (rest === 0) {
          this.getPages(6, ++this.pagination)
        } else {
          this.pagination = 0
          this.getPages(6 - rest, this.pagination)
        }
      }

      this.showAd()

      this.$store.commit('pages/setStartedRecommended', [ret.v, ret.h])
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
