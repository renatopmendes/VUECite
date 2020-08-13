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
          icon="more_vert"
        >
          <q-menu>
            <q-list>
              <q-item
                v-if="following"
                clickable
                v-close-popup
              >
                <q-item-section @click="follow(false)">Deixar de seguir</q-item-section>
              </q-item>
              <q-item
                v-if="following && following.notification"
                clickable
                v-close-popup
              >
                <q-item-section @click="notify(false)">Não receber notificações</q-item-section>
              </q-item>
              <q-item
                v-if="following && !following.notification"
                clickable
                v-close-popup
              >
                <q-item-section @click="notify(true)">Receber notificações</q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  @click="denounce(page.id)"
                  clickable
                  v-close-popup
                >
                  Denunciar
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="page">
      <div
        v-show="!showCarousel"
        class="q-my-md q-mx-xl text-center"
      >
        <avatar
          :id="page.id"
          :avatar="page.avatar"
          :size="80"
          :download="following ? 'Cache' : null"
        />

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

        <div>
          <q-btn
            v-if="!following"
            dense
            color="positive"
            label="Seguir"
            class="q-ma-sm"
            @click="follow(true)"
          />
        </div>

        <q-btn
          v-if="account.role === 9"
          color="primary"
          aria-label="Mensagem"
          icon="email"
          label="Notificar"
          @click="$router.push({ path: 'notification', query: { user: page.user_id } })"
        />
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
          :remove="account.role === 9"
          :page="page"
          :pause="showCarousel"
          @showCarousel="showCarousel=true"
        />
      </div>
    </q-page-container>
  </div>
</template>

<script>
import Avatar from 'components/Avatar.vue'
import Grid from 'components/Grid.vue'
import { openURL } from 'quasar'

import { Plugins } from '@capacitor/core'
const { FCMPlugin } = Plugins

export default {
  name: 'Profile',
  components: {
    Avatar,
    Grid
  },
  data: () => ({
    page: null,
    following: null,
    ellipsis: true,
    showCarousel: false,
    account: {
      role: 1,
      pro: 0
    }
  }),
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
    if (localStorage.getItem('account')) {
      this.account = this.$storage.getObj('account')
      const fIndex = this.account.following.findIndex(f => f.page === Number(this.$route.query.id))
      if (fIndex > -1) {
        this.following = this.account.following[fIndex]
      }
    } else {
      const following = this.$storage.getObj('following')
      const fIndex = following.findIndex(f => f.page === Number(this.$route.query.id))
      if (fIndex > -1) {
        this.following = following[fIndex]
      }
    }

    this.$axios.get(`/page/${this.$route.query.id}`)
      .then(response => {
        this.page = response.data.page
      })
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
    goUrl: function () {
      this.$q.dialog({
        message: 'Você está prestes a deixar o aplicativo para acessar uma página externa.',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        openURL(this.page.link)
      })
    },
    follow: function (bool) {
      if (bool) {
        if (localStorage.getItem('account')) {
          this.$axios.post(`following/${this.page.id}`)
            .then(response => {
              this.addFollow()
            })
        } else {
          this.addFollow()
        }
      } else {
        if (localStorage.getItem('account')) {
          this.$axios.delete(`following/${this.page.id}`)
            .then(response => {
              this.removeFollow()
            })
        } else {
          this.removeFollow()
        }
      }
    },
    addFollow: function () {
      if (localStorage.getItem('account')) {
        const account = this.$storage.getObj('account')
        account.following[account.following.length] = { page: this.page.id, notification: 1 }
        this.$storage.setObj('account', account)
      } else {
        const following = this.$storage.getObj('following')
        following[following.length] = { page: this.page.id, notification: 1 }
        this.$storage.setObj('following', following)
      }

      this.following = { page: this.page.id, notification: 1 }

      this.$axios.get(`page/${[this.page.id]}/6`)
        .then(response => {
          this.$store.commit('pages/unshiftFavorites', response.data.page)
          this.$store.commit('pages/setStartedFavorites', [0, 0])
        })

      this.notify(true)
    },
    removeFollow: function () {
      if (localStorage.getItem('account')) {
        const account = this.$storage.getObj('account')
        account.following.splice(account.following.findIndex(f => f.page === this.page.id), 1)
        this.$storage.setObj('account', account)
      } else {
        const following = this.$storage.getObj('following')
        following.splice(following.findIndex(f => f.page === this.page.id), 1)
        this.$storage.setObj('following', following)
      }

      this.following = null

      this.$store.commit('pages/removeFavorite', this.page)
      this.$store.commit('pages/setStartedFavorites', [0, 0])

      this.notify(false)
    },
    notify: function (bool) {
      const notification = bool ? 1 : 0

      if (localStorage.getItem('account')) {
        this.$axios.put(`following/${this.page.id}`, {
          notification: notification
        })
          .then(response => {
            const account = this.$storage.getObj('account')
            const index = account.following.findIndex(f => f.page === this.page.id)
            if (index > -1) {
              this.following.notification = notification
              account.following[index].notification = notification
              this.$storage.setObj('account', account)
            }
          })
      } else {
        const following = this.$storage.getObj('following')
        const index = following.findIndex(f => f.page === this.page.id)
        if (index > -1) {
          this.following.notification = notification
          following[index].notification = notification
          this.$storage.setObj('following', following)
        }
      }

      if (bool) {
        FCMPlugin
          .subscribeTo({ topic: this.page.fcm_topic })
          .then(r => {
            this.$q.notify({
              type: 'positive',
              position: 'top',
              message: 'Você receberá notificações desta página'
            })
          })
          .catch(err => console.error(err))
      } else {
        FCMPlugin
          .unsubscribeFrom({ topic: this.page.fcm_topic })
          .then(r => {
            this.$q.notify({
              type: 'warning',
              position: 'top',
              message: 'Você não receberá notificações desta página'
            })
          })
          .catch(err => console.error(err))
      }
    },
    denounce: function (pageId) {
      this.$q.dialog({
        title: 'Denunciar página!',
        message: 'Escreva um texto com os motivos da denúncia (mínimo de 10 caracteres):',
        prompt: {
          model: '',
          isValid: val => val.length > 10,
          type: 'textarea'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.$axios.post(`denounce/page/${pageId}`, {
          denounce: data
        })
      })
    }
  }
}
</script>
