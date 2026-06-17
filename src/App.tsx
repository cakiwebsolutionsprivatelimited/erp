import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './routes';
import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { TenantDataProvider } from '@/tenant/state/TenantDataProvider';

function App() {
  console.log('App rendering');
  return (
    <Provider store={store}>
      <TenantDataProvider>
        <AppRouter />
        <ModalProvider />
        <Toaster position="top-right" richColors closeButton />
      </TenantDataProvider>
    </Provider>
  );
}

export default App;
