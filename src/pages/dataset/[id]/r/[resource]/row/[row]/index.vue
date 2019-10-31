<template>
  <layout>
    <client-only>
      <div>
        <b-table
          stacked
          :fields="fields"
          :items="row"
        />
      </div>
    </client-only>
  </layout>
</template>

<script>
import axios from 'axios'
import Api from '~/services/api'

const $api = new Api()

export default {
  data () {
    return {
      resource: null,
      columns: [],
      dataset: null,
      rowid: null,
      row: null
    }
  },
  computed: {
    fields () {
      return this.columns.map(c => {
        if (this.$route.hash && this.$route.hash.substr(1) === c) {
          return {
            key: c,
            variant: 'warning'
          }
        } else {
          return c
        }
      })
    }
  },
  apollo: {
    $prefetch: false
  },
  async mounted () {
    const url = 'https://csvapi.data.gouv.fr/apify'

    const { id, resource, row } = this.$route.params
    const res = await $api.get(`datasets/${id}/resources/${resource}`)
    this.resource = res.data
    this.dataset = id
    this.rowid = row

    axios.get(`${url}?url=${this.resource.url}`)
      .then((res) => {
        this.endpoint = res.data.endpoint
        return this.endpoint
      })
      .then(endpoint => {
        const params = `_offset=${this.rowid - 1}&_size=1&_shape=objects`
        return axios.get(`${endpoint}?${params}`)
      })
      .then(res => {
        this.loading = false
        this.columns = res.data.columns
        this.row = res.data.rows
      })
      .catch((error) => {
        console.log(error)
      })

    console.log('hash: ', this.$route.hash)
  }
}
</script>
