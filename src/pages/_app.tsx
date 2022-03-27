import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';

import store from '../app/store';

import 'tacti/dist/css/tacti.global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
