<template>
  <div>
    <q-header>
      <q-toolbar class="bg-dark">
        <q-btn
          v-if="logged"
          color="secondary"
          aria-label="New"
          icon="add"
          @click="pages.length === 1 ? createPost(pages[0]) : null"
        >
          <q-menu
            v-if="pages.length > 1"
            class="z-max"
          >
            <q-list style="min-width: 100px">
              <q-item
                v-for="(page, i) in pages"
                :key="i"
                clickable
                v-close-popup
              >
                <q-item-section @click="createPost(page)">{{page.name}}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          v-else
          color="secondary"
          aria-label="New"
          icon="add"
          @click="$router.push({ path: 'register' })"
        />
        <q-space />
        <q-input
          dark
          dense
          standout
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
          flat
          round
          aria-label="Configurations"
          icon="person"
          to="configurations"
        />
        <span
          v-if="this.$store.state.pages.notifications.length"
          class="notifications bg-red-10"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-dark">
        <div class="my-menu fixed-center row justify-between text-white text-body2 text-weight-light">
          <div
            :class="{'text-weight-medium': show === 0}"
            @click="reset(0)"
          >
            Seguindo
          </div>
          <span>|</span>
          <div
            :class="{'text-weight-medium': show === 1}"
            @click="reset(1)"
          >
            Para você
          </div>
        </div>

        <favorites
          v-if="slides[0]"
          v-show="show===0"
          :pause="show===0"
          @toggleMenu="reset(1)"
        />
        <recommended
          v-if="slides[1]"
          v-show="show===1"
          :pause="show===1"
        />
      </q-page>

      <div
        v-if="!old"
        class="fit fixed-center z-max"
        style="background-color: rgba(0,0,0,0.95);"
      >
        <div
          class="absolute-center text-body1 text-white"
          style="width: 90%;"
        >
          <p>
            Deslize para cima para trocar de página.
            <br />
            Deslize para a esquerda para ver posts da mesma página.
            <br />
            Clique na imagem de capa circular para acessar a página.
            <br />
            Se houver texto descritivo no rodapé arraste-o para cima para ler tudo.
          </p>
          <q-btn
            color="secondary"
            label="OK, entendi"
            class="float-right"
            @click="started"
          />
        </div>
      </div>
    </q-page-container>

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
  </div>
</template>

<script>
import Favorites from 'components/Favorites.vue'
import Recommended from 'components/Recommended.vue'

export default {
  name: 'Index',
  components: {
    Favorites,
    Recommended
  },
  data: () => {
    return {
      logged: false,
      slides: [true, false],
      show: 0,
      pages: [],
      page: {},
      newMessagePage: null,
      old: true
    }
  },
  created () {
    if (localStorage.getItem('account')) {
      this.logged = true
      this.pages = this.$storage.getObj('account').pages
    } else {
      this.logged = false
    }

    if (!localStorage.getItem('old')) {
      this.old = false
    }

    // ADMOB
    // window.admob.setDevMode(true)
  },
  methods: {
    reset: function (value) {
      this.slides = [true, false]
      this.slides[value] = true
      this.show = value
      this.$store.commit('pages/setShow', value)
    },
    createPost: function (page) {
      this.page = page

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
    },
    searching: function (e) {
      if (e.keyCode === 13) {
        const q = e.target.value.replace(/\s{2,}/g, ' ').trim()
        if (q.length < 3) {
          this.$q.notify({
            type: 'warning',
            position: 'center',
            message: 'Mínimo de 3 caracteres'
          })
        } else {
          this.$router.push({ path: 'search', query: { q: q } })
        }
      }
    },
    started: function () {
      this.old = true
      localStorage.setItem('old', 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-menu {
  background-color: #1976D2;
  border-radius: 4px;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.3);
  padding: 2px;
  top: 60px;
  width: 160px;
  z-index: 1;
}

.notifications {
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  right: 18px;
  top: 8px;
}
</style>
