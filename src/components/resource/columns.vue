<template>
  <div>
    <div v-if="columns">
      <b-table
        striped
        hover
        :items="rows"
      />
      <small class="text-muted">
        <u>les autres colonnes :</u> {{ otherCols }}
      </small>
    </div>
    <b-alert
      v-else
      show
      variant="warning"
    >
      Aucune colonne n'a été identifiée
    </b-alert>
    <div><a :href="endpoint">api</a></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['resource'],
  data () {
    return {
      detective: {},
      columns: null,
      matchings: {},
      endpoint: null
    }
  },
  computed: {
    allCols () {
      return this.detective.metadata.header
    },
    otherCols () {
      return this.allCols.filter(x => !(x in this.columns)).join(', ')
    },
    rows () {
      const arr = Object.entries(this.columns)
        .map(([k, v]) => ({
          nom: k,
          type: v,
          référentiel: this.matchings[k]
        }))

      return arr
    }
  },
  async mounted () {
    const url = 'https://api.csvdetective.etalab.studio/csv_detective/?resource_id='
    this.endpoint = `${url}${this.resource.id}`
    const res = await axios.get(this.endpoint)

    this.detective = res.data
    this.columns = res.data.columns_ml

    const matchings = {}

    if (res.data.reference_matched_datasets) {
      for (const [k, col] of Object.entries(res.data.reference_matched_datasets.matched_datasets)) {
        matchings[col] = res.data.reference_matched_datasets.reference_datasets[k]
      }
      this.matchings = matchings
    }
  }
}
</script>
