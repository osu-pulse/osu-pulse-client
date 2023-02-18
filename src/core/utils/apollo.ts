import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { logErrorMessages } from '@vue/apollo-util'
import { useAuthentication } from '@/auth/stores/authentication'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GQL_URL,
  fetch: async (uri, options) => {
    const { getToken } = useAuthentication()

    options = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${await getToken()}`,
      },
    }
    return fetch(uri, options)
  },
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GQL_URL.replace(/^http/, 'ws'),
    connectionParams: async () => {
      const { getToken } = useAuthentication()

      return {
        Authorization: `Bearer ${await getToken()}`,
      }
    },
  }),
)

const apiLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const omitTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      (k, v) => (k === '__typename') ? undefined : v,
    )
  }
  return forward(operation)
})

const errorLink = onError((error) => {
  if (!import.meta.env.PROD)
    logErrorMessages(error)
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, omitTypenameLink, apiLink]),
  cache: new InMemoryCache(),
})
