<template>
  <div>
    <q-header>
      <q-toolbar class="bg-dark">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="!showCarousel?$router.go(-1):showCarousel=false"
        />
        <q-space />
        <q-input
          dark
          dense
          standout
          v-model="q"
          input-class="text-right"
          class="q-ml-md"
          @keyup="searching($event)"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn
          dense
          flat
          aria-label="Home"
          icon="home"
          to="/"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div v-show="!showCarousel">
          <q-infinite-scroll
            @load="getPosts"
            :offset="250"
          >
            <div class="absolute-top row content-start">
              <div
                v-for="(foundPage, k) in foundPages"
                :key="k"
                class="page"
                @click="$router.push({ path: 'profile', query: { id: foundPage.id } })"
              >
                <div class="page__content bg-dark text-white text-center">
                  <div class="absolute-center">
                    <q-avatar size="40px">
                      <img :src="path + foundPage.id + '/' + foundPage.avatar">
                    </q-avatar>
                    <div class="text-body2 ellipsis-3-lines">
                      {{foundPage.name}}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-for="(page, i) in pages"
                :key="i"
                class="page"
                @click="openCarousel(i)"
              >
                <div
                  v-if="page.posts[0].image"
                  class="page__content"
                  :style="'background-image: url('+path + page.id + '/' + page.posts[0].id + '/' + page.posts[0].image+')'"
                >
                </div>
                <div
                  v-else-if="page.posts[0].message"
                  :class="['page__content', `bg-${page.posts[0].color}-10`]"
                  :style="{'font-family': page.posts[0].family}"
                >
                  <div class="message absolute-center text-h5 text-center text-white ellipsis-2-lines">{{page.posts[0].message}}</div>
                </div>
                <div
                  v-else-if="page.posts[0].youtube"
                  class="page__content"
                  :style="'background-image: url(https://img.youtube.com/vi/'+page.posts[0].youtube+'/mqdefault.jpg)'"
                >
                  <q-icon
                    name="play_arrow"
                    color="white"
                    class="yt-play absolute-center"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="loading"
              class="bg-white fixed-bottom text-center"
            >
              <q-spinner-dots
                color="primary"
                size="4em"
              />
            </div>
          </q-infinite-scroll>
        </div>

        <div
          v-if="noPosts"
          class="fixed-center full-width text-h6 text-center"
        >
          Nenhum resultado encontrado para esta busca, utilize outro termo.
        </div>

        <carousel
          v-if="isCarousel"
          v-show="showCarousel"
          ref="mycarousel"
          :pages="pages"
          :startV="start"
          :pause="showCarousel"
          @updateV="updatedV"
          style="z-index: 1;"
        />
      </q-page>
    </q-page-container>
  </div>
</template>

<script>
import Carousel from 'components/Carousel.vue'

export default {
  name: 'Search',
  components: {
    Carousel
  },
  data: () => {
    return {
      q: null,
      oldQ: null,
      path: null,
      noPosts: false,
      loading: false,
      pagination: 0,
      foundPages: [],
      pages: [],
      account: {
        pro: 0
      },
      start: 0,
      isCarousel: false,
      showCarousel: false
    }
  },
  watch: {
    showCarousel: function (bool) {
      if (bool) {
        this.hideAd()
      } else {
        this.showAd()
      }
    }
  },
  created () {
    this.q = this.$route.query.q
    this.oldQ = this.$route.query.q
    this.path = process.env.PATH

    if (localStorage.getItem('account')) {
      this.account = this.$storage.getObj('account')
    }
  },
  mounted () {
    // ADMOB
    this.showAd()
  },
  beforeDestroy () {
    this.hideAd()
  },
  methods: {
    showAd: function () {
      if (!this.account.pro) {
        window.admob.banner.show({
          id: {
            android: 'ca-app-pub-7877878592385970/5262745096',
            ios: 'ca-app-pub-7877878592385970/5262745096'
          },
          size: {
            width: 320,
            height: 50
          }
        })
      }
    },
    hideAd: function () {
      if (!this.account.pro) {
        window.admob.banner.hide({
          android: 'ca-app-pub-7877878592385970/5262745096',
          ios: 'ca-app-pub-7877878592385970/5262745096'
        })
      }
    },
    searching: function (e) {
      if (e.keyCode === 13) {
        this.q = e.target.value.replace(/\s{2,}/g, ' ').trim()

        if (this.oldQ !== this.q) {
          if (this.q.length < 3) {
            this.$q.notify({
              type: 'warning',
              position: 'center',
              message: 'Mínimo de 3 caracteres'
            })
          } else {
            this.oldQ = this.q
            this.pagination = 0
            this.pages = []
            this.getPosts()
          }
        }
      }
    },
    getPosts: function (index, done) {
      this.loading = true

      this.$axios.get(`post/search/${this.q}/12/${this.pagination++}`)
        .then(response => {
          if (this.pagination === 1) {
            this.foundPages = response.data.pages
          }

          const posts = response.data.posts
          posts.forEach(post => {
            const page = post.page
            delete post.page
            page.posts = [post]

            this.pages.push(page)
          })

          this.loading = false
          this.noPosts = !this.foundPages.length && !this.pages.length

          if (this.$refs.mycarousel) {
            this.$refs.mycarousel.$forceUpdate()
          }

          if (posts.length === 12 && done) {
            done()
          }
        })
    },
    openCarousel: function (i) {
      this.start = i
      this.isCarousel = true
      this.showCarousel = true
      this.$emit('showCarousel')
    },
    updatedV: function (ret) {
      if (ret.v === this.pages.length - 4) {
        this.getPosts()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.foundPage {
  border: 1px solid #1d1d1d;
  border-radius: 8px;
  text-align: center;
  width: 150px;
}

.page {
  border: 1px solid #fff;
  overflow: hidden;
  width: 50%;

  &::after {
    padding-top: 75%;
    display: block;
    content: "";
  }

  &__content {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;

    .message {
      text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
      white-space: pre-line;
      word-break: break-word;
      width: 85%;
    }

    .yt-play {
      background-color: #b8331d;
      border-radius: 25%;
      font-size: 2em;
      padding: 0.11em 0.35em;
    }
  }
}
</style>
