<template>
  <q-page-container>
    <q-page class="bg-dark text-white">
      <q-toolbar class="z-max">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <q-space />
        <div class="text-body1">
          Novo vídeo
        </div>
        <q-space />
        <q-btn
          dense
          round
          color="positive"
          aria-label="Send"
          icon="send"
          @click="send"
        />
      </q-toolbar>

      <div class="q-px-xs fit absolute-top-left column justify-center items-center">
        <video
          :src="url"
          autoplay
          muted
          class="video-media full-width"
        ></video>
      </div>

      <q-btn
        dense
        aria-label="Commentary"
        icon="edit"
        class="absolute-bottom q-ml-sm q-mb-sm z-max"
        style="background-color: rgba(0, 0, 0, 0.3);"
        @click="showFooter"
      />

      <div
        v-show="showcommentary"
        class="footer-commentary fixed-bottom q-py-xs q-pl-xl q-pr-sm"
      >
        <q-input
          dark
          dense
          rounded
          standout
          autogrow
          placeholder="Adicione uma mensagem..."
          maxlength="255"
          v-model="media.commentary"
          @click="() => true"
        >
          <template v-slot:append>
            <q-icon
              v-if="media.commentary"
              name="clear"
              @click="media.commentary=null; $el.querySelector('.footer-commentary textarea').focus()"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { dom } from 'quasar'
import gifshot from 'gifshot'

import FCM from 'assets/js/FCM.js'

export default {
  name: 'VideoMessage',
  data: () => ({
    file: null,
    url: null,
    media: {},
    showcommentary: false,
    blobSize: 1 * 1024 * 1024
  }),
  created () {
    this.file = this.$route.params.file
    const url = URL.createObjectURL(this.file)
    this.url = url
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 5000)
  },
  mounted () {
    // GIF
    const video = this.$el.querySelector('.video-media')
    const ratio = dom.width(video) / dom.height(video)
    const w = dom.width(video) > 640 ? 640 : dom.width(video)
    const h = parseInt(w / ratio, 10)

    gifshot.createGIF({
      video: this.url,
      gifWidth: w,
      gifHeight: h,
      offset: 3
    }, obj => {
      if (!obj.error) {
        this.media.image = obj.image
      }
    })
  },
  methods: {
    showFooter: function () {
      this.showcommentary = !this.showcommentary
      if (this.showcommentary) {
        setTimeout(() => {
          this.$el.querySelector('.footer-commentary textarea').focus()
        }, 50)
      }
    },
    send: function () {
      this.$el.querySelector('.video-media').pause()

      this.$q.loading.show()

      const interval = setInterval(() => {
        if (this.media.image) {
          const reader = new FileReader()
          reader.onloadend = event => {
            this.media.video = event.target.result

            if (this.media.commentary && this.media.commentary.replace(/\s/g, '').length > 0) {
              this.$set(this.media, 'commentary', this.media.commentary.replace(/\s{2,}/g, ' ').trim())
            } else {
              this.media.commentary = null
            }

            this.$axios.post('post/page/' + this.$route.params.pageId, this.media)
              .then(response => {
                // Notificar
                FCM.notify(this.$route.params.pageTopic, {
                  title: this.$route.params.pageName,
                  body: this.media.commentary || 'Vídeo novo',
                  image: process.env.PATH + this.$route.params.pageId + '/' + response.data.post.id + '/' + response.data.post.image,
                  sound: 'default'
                })

                this.$router.replace({ path: 'page', query: { id: this.$route.params.pageId } })
              })
          }
          reader.readAsDataURL(this.file)

          clearInterval(interval)
        }
      }, 500)

      // Snapshot
      // const video = this.$el.querySelector('.video-media')
      // const ratio = dom.width(video) / dom.height(video)
      // const w = dom.width(video) > 1024 ? 1024 : dom.width(video)
      // const h = parseInt(w / ratio, 10)

      // gifshot.takeSnapShot({
      //   video: this.file,
      //   gifWidth: w,
      //   gifHeight: h
      // }, obj => {
      //   if (!obj.error) {
      //     const snapshot = document.createElement('img')
      //     snapshot.src = obj.image
      //   }
      // })
    }
  }
}
</script>
