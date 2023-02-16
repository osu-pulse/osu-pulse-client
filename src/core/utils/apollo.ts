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
import { useAuthentication } from '@/auth/stores/authentication'
import { GQL_URL, GQL_WS_URL } from '@/shared/constants/url-config'

const httpLink = new HttpLink({
  uri: GQL_URL,
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
    url: GQL_WS_URL,
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
      (k, v) => (k === '__typename' ? undefined : v),
    )
  }
  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (import.meta.env.DEV) {
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log('[Network error]:', networkError)
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
      // eslint-disable-next-line no-console
        console.log(
          '[GraphQL error]: Message:',
          message,
          'Location:',
          locations,
          'Path:',
          path,
        ),
      )
    }
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, omitTypenameLink, apiLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
    watchQuery: { errorPolicy: 'all' },
  },
})
