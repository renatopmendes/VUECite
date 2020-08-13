<template>
  <div>
    <q-header>
      <q-toolbar class="bg-dark">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <q-space />
        <div
          v-if="page.id"
          class="text-body1 ellipsis"
        >
          {{page.name}}
        </div>
        <div v-else>
          Nova página
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

    <q-page-container>
      <div
        v-if="crop.overlay"
        class="bg-dark fit fixed-top text-white z-max"
      >
        <q-toolbar class="absolute z-max">
          <q-btn
            dense
            flat
            aria-label="Back"
            icon="arrow_back"
            @click="crop.overlay=false"
          />
        </q-toolbar>
        <div class="fit column justify-center items-center">
          <vue-cropper
            ref="cropper"
            class="crop-avatar"
            drag-mode="move"
            :src="crop.file"
            :auto-crop-area="1"
            :aspect-ratio="1"
            :background="false"
            :min-crop-box-width="80"
            :view-mode="2"
          />
          <q-btn
            round
            color="positive"
            aria-label="Crop"
            icon="crop"
            class="q-mt-lg"
            @click="cropped"
          />
        </div>
      </div>

      <div
        v-else
        class="q-my-md q-mx-lg row justify-center"
      >
        <div class="text-center full-width">
          <q-btn
            dense
            round
            color="secondary"
            aria-label="Edit"
            icon="attach_file"
            class="z-top"
            style="margin: 60px -20px 0 0"
            @click="$el.querySelector('.input-galeria').click()"
          />
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
            aria-label="Camera"
            icon="photo_camera"
            style="margin: 60px 0 0 -20px"
            @click="$el.querySelector('.input-camera').click()"
          />

          <q-form
            class="q-mt-xl"
            @submit="send"
          >
            <q-input
              filled
              required
              minlength="3"
              maxlength="32"
              label="Nome da página"
              v-model="page.name"
            />

            <q-input
              filled
              type="url"
              label="Site externo"
              v-model="page.link"
              class="q-my-md"
            />

            <q-input
              autogrow
              filled
              label="Sobre a página"
              maxlength="2056"
              v-model="page.about"
            >
            </q-input>

            <div class="q-my-xl">
              <q-btn
                round
                aria-label="OK"
                color="positive"
                icon="done"
                type="submit"
              />
            </div>
          </q-form>
        </div>
      </div>

      <div
        v-if="page.id && countPages > 1"
        class="q-mt-xl absolute text-negative text-center full-width"
        style="bottom: -20px;"
        @click="removePage"
      >
        <q-icon
          name="delete"
          style="font-size: 1.2em;"
        />
        Remover página
      </div>

      <input
        type="file"
        accept="image/*"
        class="input-galeria hidden"
        :value="crop.value"
        @change="toggle"
      />
      <input
        type="file"
        accept="image/*"
        capture="camera"
        class="input-camera hidden"
        :value="crop.value"
        @change="toggle"
      />
    </q-page-container>
  </div>
</template>

<script>
import Avatar from 'components/Avatar.vue'

import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import Files from 'assets/js/Files.js'

export default {
  name: 'NewPage',
  components: {
    Avatar,
    VueCropper
  },
  data: () => ({
    countPages: 0,
    page: {
      name: null,
      link: null,
      about: null,
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGOSBQAAIwAgnmUiuwAAAABJRU5ErkJggg=='
    },
    crop: {
      overlay: false,
      file: null,
      value: null
    },
    oldAvatar: null
  }),
  created () {
    if (this.$route.query.id) {
      const pages = this.$storage.getObj('account').pages
      this.countPages = pages.length
      this.page = pages.filter(p => p.id === Number(this.$route.query.id))[0]
      this.oldAvatar = this.page.avatar
    }
  },
  methods: {
    toggle: function (e) {
      const url = URL.createObjectURL(e.target.files[0])
      this.crop.file = url
      this.crop.overlay = true
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 5000)
    },
    cropped: function () {
      const result = this.$refs.cropper.getCroppedCanvas({
        width: 80,
        imageSmoothingQuality: 'medium'
      })

      this.$set(this.page, 'avatar', result.toDataURL('image/jpeg'))

      this.crop.overlay = false
      this.crop.value = null
    },
    send: function () {
      this.$q.loading.show()

      this.$set(this.page, 'name', this.page.name.replace(/\s{2,}/g, ' ').trim())

      if (this.page.about && this.page.about.replace(/\s/g, '').length > 0) {
        this.$set(this.page, 'about', this.page.about.replace(/\s{2,}/g, ' ').trim())
      } else {
        this.page.about = null
      }

      if (this.page.id) {
        const sendPage = JSON.parse(JSON.stringify(this.page))
        if (!this.crop.file) {
          delete sendPage.avatar
        }

        this.$axios.put(`page/${this.page.id}`, sendPage)
          .then(response => {
            const page = response.data.page
            const account = this.$storage.getObj('account')
            account.pages[account.pages.findIndex(p => p.id === page.id)] = {
              id: page.id,
              name: page.name,
              avatar: page.avatar,
              link: page.link,
              about: page.about
            }
            this.$storage.setObj('account', account)

            if (this.crop.file) {
              Files.deleteFile(this.page.id + '/' + this.oldAvatar, 'Data')
            }

            this.crop.file = null
            this.$router.go(-1)
          })
      } else {
        this.$axios.post('page', this.page)
          .then(response => {
            const page = response.data.page
            const account = this.$storage.getObj('account')
            account.pages[account.pages.length] = {
              id: page.id,
              name: page.name,
              avatar: page.avatar,
              link: page.link,
              about: page.about
            }
            this.$storage.setObj('account', account)

            this.crop.file = null
            this.$router.go(-1)
          })
      }
    },
    removePage: function () {
      this.$q.dialog({
        message: 'Deseja realmente excluir esta página?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$axios.delete(`page/${this.page.id}`)
          .then(response => {
            const account = this.$storage.getObj('account')
            account.pages.splice(account.pages.findIndex(p => p.id === this.page.id), 1)
            this.$storage.setObj('account', account)

            this.$router.replace('/configurations')
          })
      })
    }
  }
}
</script>

<style lang="scss">
.crop-avatar {
  height: 80vh;

  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
}
</style>
