<template>
  <Layout>
    <h3>Exemples</h3>

    <ul>
      <li>
        <g-link to="/dataset/catalogue-des-donnees-de-data-gouv-fr">
          Catalogue des données de data.gouv.fr
        </g-link>
      </li>
      <li>
        <g-link to="/dataset/open-food-facts-produits-alimentaires-ingredients-nutrition-labels">
          Open Food Facts - Produits alimentaires : ingrédients, nutrition, labels
        </g-link>
      </li>
      <li>
        <g-link to="/dataset/inventaire-des-depots-de-code-source-des-organismes-publics">
          Inventaire des dépôts de code source des organismes publics
        </g-link>
      </li>
    </ul>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Hello, world!'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
