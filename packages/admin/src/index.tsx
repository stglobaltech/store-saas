import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { ApolloProvider } from '@apollo/client';
import { client } from "./services/GQL";
import { theme } from './theme';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import './theme/global.css';
import { NotifierContextProvider } from 'react-headless-notifier';

function App() {
  const engine = new Styletron();

  return (
    <ApolloProvider client={client as any}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <NotifierContextProvider
            config={{
              max: null,
              duration: 5000,
              position: 'topRight',
            }}
          >
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </NotifierContextProvider>
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

