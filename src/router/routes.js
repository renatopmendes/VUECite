
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/configurations',
        name: 'configurations',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/Configurations.vue')
      },
      {
        path: '/register',
        name: 'register',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/Register.vue')
      },
      {
        path: '/remove',
        name: 'remove',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/Remove.vue')
      },
      {
        path: '/page',
        name: 'page',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/Page.vue')
      },
      {
        path: '/newpage',
        name: 'newpage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/NewPage.vue')
      },
      {
        path: '/search',
        name: 'search',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/Search.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/Profile.vue')
      },
      {
        path: '/notifications',
        name: 'notifications',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/account/Notifications.vue')
      },
      {
        path: '/newImageMessage',
        name: 'newImageMessage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/new/ImageMessage.vue')
      },
      {
        path: '/newTextMessage',
        name: 'newTextMessage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/new/TextMessage.vue')
      },
      {
        path: '/newVideoMessage',
        name: 'newVideoMessage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/new/VideoMessage.vue')
      },
      {
        path: '/admin',
        name: 'admin',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/admin/admin.vue')
      },
      {
        path: '/notification',
        name: 'notification',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('pages/admin/notification.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
