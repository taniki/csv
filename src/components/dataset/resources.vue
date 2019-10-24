<template>
  <div>
    <dataset-resources-item
      v-for="resource in dataset.resources"
      :key="resource.id"
      :resource="resource"
    />
  </div>
</template>

<script>
import DatasetResourcesItem from '~/components/dataset/resources-item'

export default {
  components: { DatasetResourcesItem },
  props: ['dataset']
}
</script>
