<template>
  <div class="mb-5">
    <h3>
      {{ resource.title }}
    </h3>

    <b-link
      :to="previewURL"
      append
    >
      lien
    </b-link>

    <a :href="resource.url">permalien</a>

    <h4 class="mt-4">
      Colonnes
    </h4>

    <resource-columns :resource="resource" />

    <h4 class="mt-4">
      Prévisualisation
    </h4>

    <resource-preview :resource="resource" />
  </div>
</template>

<script>
import ResourceColumns from '~/components/resource/columns'
import ResourcePreview from '~/components/resource/preview'

export default {
  components: { ResourceColumns, ResourcePreview },
  props: ['resource'],
  computed: {
    previewURL () {
      return `r/${this.resource.id}`
    }
  }
}
</script>
