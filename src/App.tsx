import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './routes';
import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/modals/ModalProvider';

function App() {
  console.log('App rendering');
  return (
    <Provider store={store}>
      <AppRouter />
      <ModalProvider />
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  );
}

export default App;