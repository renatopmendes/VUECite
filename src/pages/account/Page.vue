<template>
  <div>
    <q-header>
      <q-toolbar class="bg-dark">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="!showCarousel?$router.go(-1):showCarousel=false;$refs.grider.showCarousel=false"
        />
        <q-space />
        <div class="text-body1 ellipsis">
          {{page ? page.name : 'Carregando...'}}
        </div>
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

    <q-page-container v-if="page">
      <div
        v-show="!showCarousel"
        class="q-my-md q-mx-xl text-center"
      >
        <div @click="$router.push({ path: 'newPage', query: { id: page.id } })">
          <avatar
            :id="page.id"
            :avatar="page.avatar"
            :size="80"
            download="Data"
          />
          <q-btn
            dense
            round
            color="secondary"
            aria-label="Edit"
            icon="edit"
            style="margin: 60px 0 0 -20px"
          />
        </div>

        <div
          v-if="page.link"
          class="q-mt-sm text-body2 text-weight-light"
          @click="goUrl"
        >
          <q-icon name="link" />
          {{page.link}}
        </div>

        <div
          v-if="page.views"
          class="q-mt-xs text-body2 text-weight-light"
        >
          {{page.views > 10000000 ? Math.floor(page.views / 1000000) + 'M' : (page.views > 10000 ? Math.floor(page.views / 1000) + 'K' : page.views)}} visualizações
        </div>
      </div>

      <div
        v-if="page.about"
        :class="['q-ma-md text-left', {'ellipsis': ellipsis}]"
        @click="ellipsis=!ellipsis"
      >
        {{page.about}}
      </div>

      <q-separator />

      <div class="relative-position">
        <grid
          ref="grider"
          :remove="true"
          :page="page"
          :pause="showCarousel"
          @showCarousel="showCarousel=true"
        />
      </div>

      <q-page-sticky
        position="bottom-right"
        :offset="[18, 18]"
      >
        <q-btn
          fab
          icon="add"
          color="accent"
          @click="createPost"
        />
      </q-page-sticky>

      <input
        type="file"
        accept="image/*,video/*"
        class="input-galeria hidden"
        @change="toggle"
      />
      <input
        type="file"
        accept="image/*"
        capture="camera"
        class="input-photo hidden"
        @change="toggle"
      />
      <input
        type="file"
        accept="video/*"
        capture="camcorder"
        class="input-video hidden"
        @change="toggle"
      />
    </q-page-container>
  </div>
</template>

<script>
import Avatar from 'components/Avatar.vue'
import Grid from 'components/Grid.vue'
import { openURL } from 'quasar'

export default {
  name: 'Page',
  components: {
    Avatar,
    Grid
  },
  data: () => ({
    page: null,
    ellipsis: true,
    showCarousel: false
  }),
  mounted () {
    this.$axios.get(`/page/${this.$route.query.id}`)
      .then(response => {
        this.page = response.data.page
      })
  },
  methods: {
    goUrl: function () {
      this.$q.dialog({
        message: 'Você está prestes a deixar o aplicativo para acessar uma página externa.',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        openURL(this.page.link)
      })
    },
    createPost: function () {
      const grid = true
      this.$q.bottomSheet({
        message: 'Selecione:',
        grid,
        actions: [
          {
            label: 'Galeria',
            img: 'gallery.png',
            id: 'galeria'
          },
          {
            label: 'Texto',
            img: 'text.png',
            id: 'text'
          },
          {},
          {
            label: 'Foto',
            img: 'photo.png',
            id: 'photo'
          },
          {
            label: 'Video',
            img: 'video.png',
            id: 'video'
          }
        ]
      }).onOk(action => {
        if (action.id === 'text') {
          this.$router.push({ name: 'newTextMessage', params: { pageId: this.page.id, pageName: this.page.name, pageTopic: this.page.fcm_topic } })
        } else {
          this.$el.querySelector(`.input-${action.id}`).click()
        }
      })
    },
    toggle: function (e) {
      const file = e.target.files[0]

      // Video não pode ser maior que 5MB
      if (file.type.split('/')[0] === 'video' && file.size > 5 * 1024 * 1024) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Máximo arquivo permitido: 5MB'
        })
      } else {
        const name = file.type.split('/')[0] === 'image' ? 'newImageMessage' : 'newVideoMessage'
        this.$router.push({ name: name, params: { pageId: this.page.id, pageName: this.page.name, pageTopic: this.page.fcm_topic, file: file } })
      }
    }
  }
}
</script>
