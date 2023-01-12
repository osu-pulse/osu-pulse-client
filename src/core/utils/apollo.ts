import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: GQL_URL,
  // fetch: async (uri, options) => {
  //   const token = await getToken();
  //   options = {
  //     ...options,
  //     headers: { ...options?.headers, Authorization: `Bearer ${token}` },
  //   };
  //   return fetch(uri, options);
  // },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: GQL_WS_URL,
    connectionParams: async () => {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxOTc4MiIsImp0aSI6IjEwZjcwYzZjMzQ1ZTU3ZGQ5MDg1ZjU0ZTRmNzAzMjA4OGYzN2NlZTZlMjEzMjU1NDE4OGYxNzQzNTY0ODA3YTE0YTBmZGEwYjY3MTkzY2ZiIiwiaWF0IjoxNjczNTM1MTAxLjY2MzE4NCwibmJmIjoxNjczNTM1MTAxLjY2MzE4NywiZXhwIjoxNjczNjIxNTAxLjY1MTc3MSwic3ViIjoiMjIzMzk2NTciLCJzY29wZXMiOlsiaWRlbnRpZnkiXX0.ETG7bcr01r7od1_DFQMVAqTDzdiZ5cjWwnyKVAD63WHoqPj0bigL7LpEn3URfv2poP2H2BAodAmlsNvkUB5CoHThl7_jcLRw6Jw4aRkX5NfmdX0h2uweWvEr4pPlg0GkpRYS66AWFG8BIZ9OWmyYT3fRACDC-SvIGOUJYXxkjlHefpEH3suKmSTIfbX08QNjrlOF6myInTH--FetPcs70IM-xU2YM0iVTFelj6I2hYYTQS-BnzsjX7F47v6Ivnc05XXkKfnpKf_vpZxxoGlF71vBzMO64t-2rlHfMuzI5nvMNCRCp-PTAV2GooNbn8lK0a-fI4pWx_Hgz3yZZjLr72GxeikW3agV_1_POAgfneezHzw2avrkLWUxSbjugO1HLLl9bQtpAmG012eUI8ZN-VOxXkimSEo2pIOX-RZ9AckUpVhSlawrhcIDxgZEBiFJQmdD5AM4ldyuNbAiOc2HSJ3qwoiWOYEUBFGvS620NgtN8XZvL4BGHS9GFKgCCISAxVa2Vgc2FQBRdXgHrEKHRwnD1ETF2NtWkKe3LXdahcf17KckZUIiXHwCnHgX1pUmiqtBfxyu2BwC5zx1SDAzE2i-xCoHH7w66CHnba0aXOvaS81pmIYnO9x-WXzPQtXLUtOiLWA0z0HJAY1YUzr4F2DThtVxafz8jnD7PdKAwDk';
      // const token = await getToken();
      return {
        Authorization: `Bearer ${token}`,
      };
    },
  }),
);

const apiLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const omitTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      (k, v) => (k === '__typename' ? undefined : v),
    );
  }
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log('[Network error]:', networkError);
  }

  if (graphQLErrors)
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
    );
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, omitTypenameLink, apiLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
    watchQuery: { errorPolicy: 'all' },
  },
});
