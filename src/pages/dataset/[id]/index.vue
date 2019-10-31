<template>
  <layout>
    <div>
      <apollo-query
        :query="gql => gql`
          query ($id: ID) {
            dataset (id: $id){
              title
              page
              description

              resources {
                id
                url
                title
              }
            }
          }
        `"
        :variables="{ id }"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="error">
            {{ error }}
          </div>
          <div v-if="loading" />
          <div v-if="data">
            <b-container class="pt-5">
              <h1>{{ data.dataset.title }}</h1>

              <a :href="data.dataset.page">permalien</a>

              <div
                class="my-4"
                v-html="parse(data.dataset.description)"
              />

              <h3 class="text-muted">
                Ressources
              </h3>

              <dataset-resources :dataset="data.dataset" />
            </b-container>
          </div>
        </template>
      </apollo-query>
    </div>
  </layout>
</template>

<script>
import DatasetResources from '~/components/dataset/resources'

import unified from 'unified'
import markdown from 'remark-parse'
import html from 'remark-html'
import breaks from 'remark-breaks'

const $processor = unified()
  .use(markdown)
  .use(breaks)
  .use(html)

export default {
  components: { DatasetResources },
  data () {
    return {
      id: null,
      data: null,
      dataset: {}
    }
  },
  methods: {
    parse (md) {
      return $processor.processSync(md).toString()
    }
  },
  async mounted () {
    const { id } = this.$route.params
    this.id = id
  }
}
</script>
