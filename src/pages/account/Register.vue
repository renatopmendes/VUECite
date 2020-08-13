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
          Conta
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
      <q-banner class="bg-primary text-white text-center">
        Acesse sua conta ou registre-se para ter acesso a outras funcionalidades e criar seus conteúdos.
      </q-banner>

      <q-page>
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            name="login"
            label="Login"
          />
          <q-tab
            name="create"
            label="Cadastro"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          animated
          class="q-mt-xl text-center"
        >
          <q-tab-panel name="login">
            <q-form @submit="loginin">
              <q-input
                autofocus
                filled
                required
                type="email"
                label="E-mail"
                v-model="login.email"
              >
                <template v-slot:append>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                filled
                required
                minlength="8"
                label="Senha"
                :type="isLoginPwd ? 'password' : 'text'"
                v-model="login.password"
                class="q-mt-md"
              >
                <template v-slot:append>
                  <q-icon
                    :name="!isLoginPwd ? 'visibility' : 'visibility_off'"
                    @click="isLoginPwd = !isLoginPwd"
                  />
                </template>
              </q-input>
              <p
                class="text-left text-caption text-primary"
                @click="forgotPassword"
              >Esqueci a senha</p>

              <q-btn
                round
                aria-label="OK"
                color="positive"
                icon="done"
                type="submit"
                class="q-mt-lg"
              />
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="create">
            <q-form @submit="register">
              <q-input
                autofocus
                filled
                required
                minlength="3"
                maxlength="32"
                label="Nome"
                v-model="create.name"
              >
                <template v-slot:append>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                filled
                required
                type="email"
                label="E-mail"
                v-model="create.email"
                class="q-my-md"
              >
                <template v-slot:append>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                filled
                required
                minlength="8"
                label="Senha"
                :type="isCreatePwd ? 'password' : 'text'"
                v-model="create.password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="!isCreatePwd ? 'visibility' : 'visibility_off'"
                    @click="isCreatePwd = !isCreatePwd"
                  />
                </template>
              </q-input>

              <div
                class="q-mt-lg text-left text-caption text-primary"
                @click="showAccept=true"
              >
                Registrando-se você concorda com nossos Termos e Política de Dados.
              </div>

              <q-btn
                round
                aria-label="OK"
                color="positive"
                icon="done"
                type="submit"
                class="q-mt-lg"
              />
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>

    <q-dialog v-model="showAccept">
      <q-card>
        <q-card-section>
          <div class="text-h6">Termos e Política de Dados</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Bem-vindo ao "Cite.
          <br />
          "Cite cria tecnologias e serviços para que a pessoas possam criar e compartilhar conteúdos como mensagens, reflexões, citações, pensamentos e outros.
          <br />
          Os dados de cadastro que você fornece são confidenciais e não compartilhamos tampouco vendemos para ninguém.
          <br />
          Todos os dados, incluindo seus conteúdos e mensagens podem ser registrados e armazenados em servidores fora de seu país de origem.
          <br />
          Não são permitidos conteúdos ilícitos, enganosos, fraudulentos ou com finalidade ilegal ou não autorizada, ofensivos, discriminatórios, fraudulentos, impróprios a menores de 18 anos, que infrinja ou viole o direito de outras pessoas ou que viole esses termos.
          <br />
          Nos reservamos o direito de remover ou restringir o acesso a conteúdo que viole essas disposições.
          <br />
          Você nos concede a permissão para usar o conteúdo que você cria e compartilha: o conteúdo que você compartilha ou carrega, como fotos e vídeos, pode ser protegido por leis de propriedade intelectual.
          Você é proprietário dos direitos de propriedade intelectual (como direitos autorais ou marcas registradas) sobre o conteúdo que cria e compartilha no "Cite. Nada nestes Termos afasta os direitos que você possui sobre seu próprio conteúdo. Você é livre para compartilhar seu conteúdo com qualquer pessoa, onde você quiser.
          No entanto, para fornecer nossos serviços, precisamos que você nos conceda algumas permissões legais (conhecidas como “licença”) para usar esse conteúdo.
          Especificamente, quando você compartilha, publica ou carrega conteúdo protegido por direitos de propriedade intelectual em nossos Produtos ou em conexão com nossos Produtos, você nos concede uma licença não exclusiva, transferível, sublicenciável, isenta de royalties e válida mundialmente para hospedar, usar, distribuir, modificar, veicular, copiar, executar publicamente ou exibir, traduzir e criar trabalhos derivados de seu conteúdo (de modo consistente com suas configurações de privacidade e do aplicativo).
          Isso significa, por exemplo, que se você compartilhar uma foto no "Cite, você nos dará permissão para armazená-la, copiá-la e compartilhá-la com outras pessoas (mais uma vez, de modo consistente com suas configurações), como os provedores de serviços que fornecem suporte para nosso serviço.
          Essa licença será encerrada quando o conteúdo for excluído de nossos sistemas.
          Você pode excluir conteúdo individualmente ou todo de uma vez excluindo sua conta.
          Quando você excluir o conteúdo, ele deixará de estar visível para outros usuários.
          <br />
          Se entendermos que você violou nossos Termos ou Políticas de forma manifesta, grave ou recorrente, poderemos suspender ou desativar permanentemente o acesso a sua conta.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'
const { FCMPlugin } = Plugins

export default {
  name: 'Register',
  data: function () {
    return {
      tab: 'login',
      login: {},
      create: {},
      showAccept: false,
      isLoginPwd: true,
      isCreatePwd: true
    }
  },
  created () {
    if (localStorage.getItem('account')) {
      this.$router.replace('configurations')
    }
  },
  methods: {
    forgotPassword: function () {
      if (this.login.email) {
        this.$q.dialog({
          message: 'Uma nova senha será enviada ao seu e-mail.',
          cancel: 'Cancelar',
          ok: 'Confirmar'
        }).onOk(() => {
          this.$q.loading.show()

          this.$axios.post('auth/forgotpassword', {
            email: this.login.email
          })
        })
      } else {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Preencha o seu e-mail'
        })
      }
    },
    loginin: function () {
      this.$q.loading.show()

      const params = {
        email: this.login.email,
        password: this.login.password
      }

      if (localStorage.getItem('following')) {
        params.following = this.$storage.getObj('following')
      }

      this.$axios.post('auth/login', params)
        .then(response => this.success(response))
    },
    register: function () {
      this.$q.loading.show()

      this.$set(this.create, 'name', this.create.name.replace(/\s{2,}/g, ' ').trim())

      const params = {
        name: this.create.name,
        email: this.create.email,
        password: this.create.password
      }

      if (localStorage.getItem('following')) {
        params.following = this.$storage.getObj('following')
      }

      this.$axios.post('auth/register', params)
        .then(response => this.success(response))
    },
    success: function (response) {
      this.$q.loading.show()

      localStorage.clear()
      localStorage.setItem('old', 1)

      this.$storage.setObj('bear', response.data.access_token)
      this.$axios.defaults.headers.Authorization = `Bearer ${response.data.access_token}`

      const user = response.data.user
      const following = user.following.map(f => { return { page: f.page_id, notification: f.notification } })
      this.$storage.setObj('account', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        pro: user.pro,
        following: following,
        pages: user.pages.map(p => {
          return {
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            link: p.link,
            about: p.about,
            fcm_topic: p.fcm_topic
          }
        })
      })

      if (following.length) {
        this.$axios.get(`favorites/6/6/0/${following.map(f => f.page).join(',')}`)
          .then(response => {
            this.$store.commit('pages/clearFavorites')
            this.$store.commit('pages/pushFavorites', response.data.data)
            this.$store.commit('pages/setStartedFavorites', [0, 0])
          })

        this.$q.loading.show()
      }

      if (user.notifications && user.notifications.length) {
        this.$store.commit('pages/clearNotifications')
        this.$store.commit('pages/pushNotifications', user.notifications.reverse())
      }

      this.$axios.get('following/notifications')
        .then(response => {
          response.data.data.forEach(notification => {
            FCMPlugin
              .subscribeTo({ topic: notification.page.fcm_topic })
              .then(r => console.log('subscribed to topic'))
              .catch(err => console.log(err))
          })

          this.$router.replace('configurations')
        })
        .catch((error) => {
          console.log(error)

          this.$router.replace('configurations')
        })
    }
  }
}
</script>
