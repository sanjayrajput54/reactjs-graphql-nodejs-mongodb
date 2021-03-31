import { ApolloClient, InMemoryCache,gql,ApolloLink, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {useAuthToken} from './auth';
const logoutLink =(fnLogout) => onError(err => {
  const { graphQLErrors, networkError }=err;
  if (graphQLErrors)
    for(const item of graphQLErrors){
      const { message, locations, path }=item;
      if (['Un-Authrized user'].includes(message)) {
        // useLogout()();
        return false;
      }
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    };
  if (networkError) console.log(`[Network error]: ${networkError}`);
})
const authMiddleware = (authToken) => setContext((_, { headers }) => {
  if(authToken){
    return {
      headers: {
        ...headers,
        Authorization:`Bearer ${authToken}`
      }
    }
  }
  return {
    headers: {
      ...headers,
    }
  }
});
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

export const Initialized=(logoutFn)=>{
  const [authToken,removeAuthToken]=useAuthToken();
  const cache = new InMemoryCache();
const mWare=authMiddleware(authToken);
const mLogoutLink=logoutLink(removeAuthToken);
return new ApolloClient({
  link: ApolloLink.from([mWare,mLogoutLink.concat(httpLink)]),
  cache: cache
});;
}

