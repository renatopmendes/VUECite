<template>
  <div>
    <div v-show="!showCarousel">
      <q-infinite-scroll
        @load="getPosts"
        :offset="50"
      >
        <div class="absolute-top row content-start">
          <div
            v-for="(post, i) in pages[0].posts"
            :key="i"
            class="post"
            @click="openCarousel(i)"
          >
            <div
              v-if="post.image"
              class="post__content"
              :style="'background-image: url('+path + post.id + '/' + post.image+')'"
            >
              <q-btn
                v-if="remove"
                dense
                rounded
                icon="delete"
                color="negative"
                class="absolute"
                style="right: 5px; top: 5px;"
                @click.stop="removePost(post.id, i)"
              />
            </div>
            <div
              v-else-if="post.message"
              :class="['post__content', `bg-${post.color}-10`]"
              :style="{'font-family': post.family}"
            >
              <q-btn
                v-if="remove"
                dense
                rounded
                icon="delete"
                color="negative"
                class="absolute"
                style="right: 5px; top: 5px;"
                @click.stop="removePost(post.id, i)"
              />
              <div class="message absolute-center text-h5 text-center text-white ellipsis-2-lines">{{post.message}}</div>
            </div>
            <div
              v-else-if="post.youtube"
              class="post__content"
              :style="'background-image: url(https://img.youtube.com/vi/'+post.youtube+'/mqdefault.jpg)'"
            >
              <q-btn
                v-if="remove"
                dense
                rounded
                icon="delete"
                color="negative"
                class="absolute"
                style="right: 5px; top: 5px;"
                @click.stop="removePost(post.id, i)"
              />
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

    <div v-if="noPosts">
      <div class="q-ma-xl text-h5 text-center">Nada ainda por aqui.</div>
      <div
        class="q-pa-sm fixed full-width bg-primary text-white text-center"
        style="bottom: 28px;"
      >
        Crie o seu primeiro conteúdo.
      </div>
    </div>

    <carousel
      v-if="isCarousel"
      v-show="showCarousel"
      ref="mycarousel"
      :pages="pages"
      :startH="start"
      :pause="pause"
      @updateH="updatedH"
      style="z-index: 1;"
    />
  </div>
</template>

<script>
import Carousel from 'components/Carousel.vue'

export default {
  name: 'Grid',
  components: {
    Carousel
  },
  props: {
    page: {
      type: Object,
      default: () => null
    },
    remove: {
      type: Boolean,
      default: () => false
    },
    pause: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      path: null,
      noPosts: false,
      loading: false,
      pagination: 0,
      pages: [{
        posts: []
      }],
      start: 0,
      isCarousel: false,
      showCarousel: false
    }
  },
  created () {
    this.path = process.env.PATH + this.page.id + '/'

    this.pages[0] = this.page
    this.pages[0].posts = []
  },
  methods: {
    getPosts: function (index, done) {
      this.loading = true

      this.$axios.get(`page/${this.page.id}/posts/12/${this.pagination++}`)
        .then(response => {
          const posts = response.data.data
          posts.forEach(post => {
            this.pages[0].posts.push(post)
          })

          this.loading = false
          this.noPosts = this.pages[0].posts.length === 0

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
    updatedH: function (ret) {
      if (ret.h === this.pages[0].posts.length - 4) {
        this.getPosts()
      }
    },
    removePost: function (postId, index) {
      this.$q.dialog({
        message: 'Deseja realmente excluir este post?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$axios.delete(`post/${postId}`)
          .then(response => {
            this.pages[0].posts.splice(index, 1)
            this.$forceUpdate()

            this.noPosts = this.pages[0].posts.length === 0
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
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
