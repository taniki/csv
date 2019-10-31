import DefaultLayout from '~/layouts/Default.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default function (Vue, { router, head, isClient, appOptions }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  Vue.use(BootstrapVue)
  Vue.use(VueApollo)

  if (isClient) {
    const httpLink = createHttpLink({
      // You should use an absolute URL here
      uri: 'https://gateway.tkd.now.sh'
    })

    const cache = new InMemoryCache()

    const apolloClient = new ApolloClient({
      link: httpLink,
      cache
    })

    appOptions.apolloProvider = new VueApollo({
      defaultClient: apolloClient
    })
  }
}
