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
        <div class="text-body1">
          ADMIN
        </div>
        <q-space />
        <q-btn
          dense
          flat
          aria-label="Notification"
          icon="email"
          to="notification"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-my-sm text-body1 text-center">
        Usuários: {{infos.users}}
        <br />
        Páginas: {{infos.pages}}
        <br />
        Posts: {{infos.posts}}
      </div>

      <q-separator />

      <p class="q-mt-md text-h5 text-center text-primary">Denúncias</p>
      <q-infinite-scroll
        @load="getDenounces"
        :offset="250"
      >
        <q-list bordered>
          <q-expansion-item
            v-for="(denounce, i) in denounces"
            :key="i"
            expand-separator
            icon="flag"
            :label="denounce.page.name"
          >
            <q-card>
              <q-item>
                <q-item-section
                  avatar
                  @click.stop="$router.push({ path: 'profile', query: { id: denounce.page.id } })"
                >
                  <avatar
                    :id="denounce.page.id"
                    :avatar="denounce.page.avatar"
                    :size="48"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{denounce.user.name}}</q-item-label>
                  <q-item-label caption>
                    {{denounce.user.email}}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-card-section
                v-if="denounce.denouncer"
                class="text-right"
              >
                <div class="text-body1">
                  Denunciante
                </div>
                <div>
                  {{denounce.denouncer.name}}
                </div>
                <div class="text-caption text-weight-light">
                  {{denounce.denouncer.email}}
                </div>
              </q-card-section>

              <q-card-section>
                {{denounce.denounce}}
              </q-card-section>

              <q-card-actions align="around">
                <q-btn
                  flat
                  @click="punish(denounce.user_id)"
                >Punir</q-btn>
                <q-btn
                  flat
                  color="red"
                  icon="delete"
                  @click="remove(denounce.id)"
                />
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-infinite-scroll>

      <div v-if="!denounces.length" class="text-body1 text-center absolute-center">
        Nenhuma denúncia.
      </div>
    </q-page-container>
  </div>
</template>

<script>
import Avatar from 'components/Avatar.vue'

export default {
  name: 'denounces',
  components: {
    Avatar
  },
  data: function () {
    return {
      infos: {
        users: 0,
        pages: 0,
        posts: 0
      },
      denounces: [],
      pagination: 0
    }
  },
  created () {
    const account = this.$storage.getObj('account')
    if (account.role < 9) {
      this.$router.replace('/')
    }

    this.$axios.get('auth/infos')
      .then(response => {
        this.infos = response.data
      })
  },
  methods: {
    getDenounces: function (index, done) {
      this.$axios.get(`denounce/50/${this.pagination++}`)
        .then(response => {
          const denounces = response.data.data
          denounces.forEach(denounce => {
            this.denounces.push(denounce)
          })

          if (denounces.length === 50 && done) {
            done()
          }
        })
    },
    punish: function (userId) {
      this.$q.dialog({
        message: 'Punir este usuário?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$axios.put(`auth/punish/${userId}`)
      })
    },
    remove: function (id) {
      const denounce = this.denounces[this.denounces.findIndex(n => n.id === id)]
      this.$q.dialog({
        message: 'Excluir esta denúncia?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$axios.delete(`denounce/${denounce.id}`)
          .then(response => {
            this.denounces.splice(this.denounces.findIndex(d => d.id === denounce.id), 1)
          })
      })
    }
  }
}
</script>
