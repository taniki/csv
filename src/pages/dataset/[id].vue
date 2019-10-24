<template>
  <div>
    <b-container class="pt-5">
      <h1>{{ dataset.title }}</h1>

      <a :href="dataset.page">permalien</a>

      <div
        class="my-4"
        v-html="parse(dataset.description)"
      />

      <h3 class="text-muted">
        Ressources
      </h3>

      <dataset-resources :dataset="dataset" />

      <b-container />
    </b-container>
  </div>
</template>

<script>
import DatasetResources from '~/components/dataset/resources'

import Api from '~/services/api'
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'remark-html'
import breaks from 'remark-breaks'

const $api = new Api()

const $processor = unified()
  .use(markdown)
  .use(breaks)
  .use(html)

export default {
  components: { DatasetResources },
  data () {
    return {
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
    const res = await $api.get(`datasets/${id}`)
    this.dataset = res.data
    this.id = id
  }
}
</script>
