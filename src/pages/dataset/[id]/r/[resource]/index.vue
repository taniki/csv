<template>
  <div>
    <resource-preview
      :resource="resource"
      v-if="resource"
      :show-row-id="true"
    />
  </div>
</template>

<script>
import ResourcePreview from '~/components/resource/preview'

import Api from '~/services/api'

const $api = new Api()

export default {
  components: { ResourcePreview },
  data () {
    return {
      resource: null,
      dataset: null
    }
  },
  async mounted () {
    const { id, resource } = this.$route.params
    const res = await $api.get(`datasets/${id}/resources/${resource}`)
    this.resource = res.data
    this.dataset = id
  }
}

</script>
