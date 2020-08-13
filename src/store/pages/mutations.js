// ADS
export const setcounterAd = (state) => {
  state.counterAd++
}
export const setAds = (state) => {
  state.ads *= 3
}

// SHOW - MENU INICIAL
export const setShow = (state, show) => {
  state.show = show
}

// STARTED
export const setStartedRecommended = (state, startedRecommended) => {
  state.startedRecommended = startedRecommended
}

export const setStartedFavorites = (state, startedFavorites) => {
  state.startedFavorites = startedFavorites
}

// FAVORITES
export const clearFavorites = (state) => {
  state.favorites = []
}

export const pushFavorites = (state, pages) => {
  pages.forEach(page => {
    state.favorites.push(page)
  })
}

export const unshiftFavorites = (state, page) => {
  state.favorites.unshift(page)
}

export const removeFavorite = (state, page) => {
  const index = state.favorites.findIndex(f => f.id === page.id)
  state.favorites.splice(index, 1)
}

export const pushFavoritesPosts = (state, posts) => {
  const index = state.favorites.findIndex(f => f.id === posts[0].page_id)
  posts.forEach(post => {
    state.favorites[index].posts.push(post)
  })
}

// RECOMMENDED
export const clearRecommended = (state) => {
  state.recommended = []
}

export const pushRecommended = (state, pages) => {
  pages.forEach(page => {
    state.recommended.push(page)
  })
}

export const pushRecommendedPosts = (state, posts) => {
  const index = state.recommended.findIndex(r => r.id === posts[0].page_id)
  posts.forEach(post => {
    state.recommended[index].posts.push(post)
  })
}

// NOTIFICATIONS
export const clearNotifications = (state) => {
  state.notifications = []
}

export const pushNotifications = (state, notifications) => {
  notifications.forEach(notification => {
    state.notifications.push(notification)
  })
}

export const readedNotification = (state, notification) => {
  const index = state.notifications.findIndex(f => f.id === notification.id)
  state.notifications.splice(index, 1, notification)
}

export const removeNotification = (state, notification) => {
  const index = state.notifications.findIndex(f => f.id === notification.id)
  state.notifications.splice(index, 1)
}

// src/store/pages/state.js
// Always use a function to return state if you use SSR
export default function () {
  return {
    ads: 6,
    counterAd: 0,
    show: 0,
    favorites: [],
    recommended: [],
    notifications: [],
    startedRecommended: [0, 0],
    startedFavorites: [0, 0]
  }
}
