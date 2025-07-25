import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store, persistor } from './store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer />
    </PersistGate>
  </Provider>,
)
