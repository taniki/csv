<template>
  <div>
    <div>
      <b-pagination
        v-model="currentPage"
        :total-rows="total"
        :per-page="perPage"
        aria-controls="my-table"
        size="sm"
        align="center"
        v-if="total > 0"
      />

      <b-container
        fluid
        class="full-width px-4"
      >
        <b-table
          striped
          bordered
          small
          hover
          :fields="fields"
          primary-key="rowid"
          :items="provider"
          head-variant="light"
          :no-border-collapse="true"
          sticky-header="500px"
          responsive
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template #cell(rowid)="data">
            <b-link
              append
              :to="`row/${data.item.rowid}`"
            >
              {{ data.item.rowid }}
            </b-link>
          </template>
          <template
            v-slot:table-caption
            v-if="error"
          >
            <b-container>
              <b-alert
                show
                variant="danger"
              >
                {{ error }}
              </b-alert>
            </b-container>
          </template>
        </b-table>
      </b-container>

      <div v-if="total">
        {{ this.columns.length }} colonnes x {{ this.total }} lignes - <a :href="endpoint">api</a>
      </div>
    </div>
    <div v-if="loading">
      <b-spinner
        small
        type="grow"
        label="Loading..."
        variant="secondary"
      />
    </div>
    <div
      class="center text-muted"
      v-if="!total && !loading"
    >
      Ce fichier n'est pas prévisualisable
    </div>
  </div>
</template>

<style>
.full-width {
    width: 100vw;
    position: relative;
    margin-left: -50vw;
    left: 50%;
}

.full-height {
  height: 100vh;
}
</style>

<script>
import axios from 'axios'

export default {
  props: ['resource', 'showRowId'],
  data () {
    return {
      endpoint: null,
      total: 0,
      error: null,
      currentPage: 1,
      perPage: 100,
      loading: true,
      columns: []
    }
  },
  computed: {
    fields () {
      return [
        {
          key: 'rowid',
          isRowHeader: true
        }, ...this.columns.filter(c => c !== 'rowid')
      ]
    }
  },
  async mounted () {
  },
  methods: {
    provider (ctx, callback) {
      const url = 'https://csvapi.data.gouv.fr/apify'
      this.loading = true
      axios.get(`${url}?url=${this.resource.url}`)
        .then((res) => {
          this.endpoint = res.data.endpoint
          return this.endpoint
        })
        .then(endpoint => {
          let params = `_offset=${(ctx.currentPage - 1) * ctx.perPage}&_shape=objects`

          if (!this.showRowId) {
            params += '&_rowid=hide'
          }

          return axios.get(`${endpoint}?${params}`)
        })
        .then(res => {
          this.loading = false
          this.columns = res.data.columns
          this.total = res.data.total
          callback(res.data.rows)
        })
        .catch((error) => {
          this.loading = false
          this.error = error.toString()
          callback(null)
        })

      return null
    }
  }
}
</script>
