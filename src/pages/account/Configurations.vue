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
          Configurações
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

    <q-page-container class="q-pb-xl">
      <div v-if="account">
        <div
          v-if="account.role < 9"
          class="q-py-lg text-center text-body1"
        >
          {{account.email}}
        </div>
        <div
          v-else
          class="q-py-lg text-center text-body1"
          @click="$router.push('admin')"
        >
          {{account.email}}
        </div>

        <q-separator />

        <div class="q-ma-lg">
          <div
            v-for="(page, i) in account.pages"
            :key="i"
            class="q-mb-md row items-center"
            @click="$router.push({ path: 'page', query: { id: page.id } })"
          >
            <div>
              <avatar
                :id="page.id"
                :avatar="page.avatar"
                download="Data"
              />
            </div>

            <div
              class="q-ml-sm"
              style="max-width: 80%;"
            >
              <div class="text-body1">
                {{page.name}}
              </div>
              <div class="text-weight-light ellipsis">
                {{page.about}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="q-pa-xl text-center"
      >
        <q-btn
          color="dark"
          icon="person"
          label="Autenticar"
          to="/register"
        />
      </div>

      <q-separator />

      <div
        v-if="!account"
        class="q-ma-xl absolute-center full-width text-center text-body1"
      >
        <p>Autentique-se para ter acesso a outras funcionalidades.</p>
        <p>Crie e compartilhe seus próprios conteúdos.</p>
      </div>

      <div class="q-ma-lg">
        <div
          v-if="notifications.length"
          class="q-mb-md row items-center"
          @click="$router.push('notifications')"
        >
          <q-icon
            name="email"
            size="2em"
            color="red-10"
          />
          <div class="q-ml-sm">
            <div class="text-body1">
              Mensagens
            </div>
            <div class="text-weight-light">
              Você tem {{notifications.length}} mensagens
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="account"
        class="absolute text-negative full-width"
        style="bottom: -20px;"
        @click="deleteAccount"
      >
        <q-icon
          name="delete"
          style="font-size: 1.2em;"
        />
        Excluir conta
      </div>

      <q-page-sticky
        position="bottom-right"
        :offset="[18, 18]"
      >
        <q-btn
          v-if="account && account.pro"
          fab
          label="Nova página"
          icon="add"
          color="accent"
          @click="newPage"
        />
      </q-page-sticky>
    </q-page-container>
  </div>
</template>

<script>
import Avatar from 'components/Avatar.vue'

export default {
  name: 'Configurations',
  components: {
    Avatar
  },
  data: function () {
    return {
      account: null,
      notifications: []
    }
  },
  created () {
    if (localStorage.getItem('account')) {
      this.account = this.$storage.getObj('account')
    }

    this.notifications = this.$store.state.pages.notifications
  },
  methods: {
    newPage: function () {
      if (localStorage.getItem('account')) {
        this.$router.push('newPage')
      } else {
        this.$router.push('register')
      }
    },
    deleteAccount: function () {
      this.$q.dialog({
        message: 'Deseja realmente excluir sua conta?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$router.push('remove')
      })
    }
  }
}
</script>
