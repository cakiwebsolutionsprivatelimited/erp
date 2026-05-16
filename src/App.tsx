import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppRouter } from '@/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  );
}

export default App;