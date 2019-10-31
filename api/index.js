const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json')

const axios = require('axios')

const csvapi = 'https://csvapi.data.gouv.fr/apify'

async function getColumns (csvUrl) {
  let columns = []

  try {
    const apify = await axios.get(`${csvapi}?url=${csvUrl}`)
    const endpoint = apify.data.endpoint

    const params = '_offset=0&_size=1&_shape=objects'

    const content = await axios.get(`${endpoint}?${params}`)
    columns = content.data.columns
  } catch (err) {
    console.log(err)
  }

  return columns
}

async function getRow (csvUrl, rowId) {
  const apify = await axios.get(`${csvapi}?url=${csvUrl}`)
  const endpoint = apify.data.endpoint

  const params = `_offset=${rowId - 1}&_size=1&_shape=objects`

  const content = await axios.get(`${endpoint}?${params}`)
  const row = content.data.rows[0]

  return row
}

async function getCell (csvUrl, rowId, column) {
  const row = await getRow(csvUrl, rowId)
  return row[column]
}

const typeDefs = gql`
  scalar JSON

  type Cell {
    csv: CSV
    row: Row
    column: Column

    content: String

    view: String

  }

  type Row {
    csv: CSV
    rowid: Int
    content: JSON

    cell (column: String) : Cell
  }

  type Column {
    name: String
  }

  type CSV {
    url: String

    columns: [Column]
    row (rowid: Int) : Row
    cell (rowid: Int, column: String) : Cell
  }

  extend type Query {
    csv (url: String) : CSV
  }
`

const resolvers = {
  Query: {
    csv (parent, args, context) {
      const csv = {
        url: args.url
      }

      return csv
    }
  },
  CSV: {
    async columns (parent, args, context) {
      const columns = await getColumns(parent.url)

      return columns.map(x => ({ name: x }))
    },
    async row (parent, { rowid }, context) {
      const content = await getRow(parent.url, rowid)

      return { csv: parent, rowid, content }
    },
    async cell (parent, args, context) {
      const content = await getCell(parent.url, args.rowid, args.column)

      return { content }
    }
  },
  Row: {
    async cell (parent, args, context) {
      const content = await getCell(parent.csv.url, parent.rowid, args.column)

      return { content }
    }
  },
  Cell: {
    view (parent, args, context) {
      // This won't work yet
      const dataset = parent.dataset.id
      const resource = parent.resource.id
      const row = parent.row.rowid

      return `https://csv.tkd.now.sh/dataset/${dataset}/r/${resource}/row/${row}`
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  tracing: true,
  playground: true
})

// module.exports = server.createHandler({ path: '/api' })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
