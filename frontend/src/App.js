import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import MainNavigation from './components/navigation/header';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ApolloProvider } from '@apollo/client';
import {Initialized} from './graphql/buildApolooClient';
import RoutesMapping from './routes';
import './App.css';
import "react-datetime/css/react-datetime.css";

const App=()=> {
const appApolloClient=Initialized()
  return (<BrowserRouter><React.Fragment>
    <ApolloProvider client={appApolloClient}>
    <React.Fragment>
      <MainNavigation/>
      <main className="main-content">
      <RoutesMapping/>
      </main>
     </React.Fragment>
    </ApolloProvider>
    </React.Fragment>
    </BrowserRouter>
  );
}
export default App;
