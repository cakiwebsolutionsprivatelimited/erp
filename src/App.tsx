import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './routes';
import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { TenantDataProvider } from '@/tenant/state/TenantDataProvider';
import { FinanceDataProvider } from '@/tenant/finance/state/FinanceDataProvider';
import { InventoryDataProvider } from '@/tenant/inventory/state/InventoryDataProvider';
import { ServicesDataProvider } from '@/tenant/services/ServicesDataProvider';
import { HrDataProvider } from '@/tenant/hr/HrDataProvider';
import { WebsiteDataProvider } from '@/tenant/website/WebsiteDataProvider';

function App() {
  return (
    <Provider store={store}>
      <TenantDataProvider>
        <FinanceDataProvider>
          <InventoryDataProvider>
            <ServicesDataProvider>
              <HrDataProvider>
                <WebsiteDataProvider>
                  <AppRouter />
                  <ModalProvider />
                  <Toaster position="top-right" richColors closeButton />
                </WebsiteDataProvider>
              </HrDataProvider>
            </ServicesDataProvider>
          </InventoryDataProvider>
        </FinanceDataProvider>
      </TenantDataProvider>
    </Provider>
  );
}

export default App;
