import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/tenant/components/TenantUI';
import { ProductForm } from '@/tenant/inventory/components/ProductForm';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const ProductFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const product = id ? inventory.products.find((item) => item.id === id) : undefined;

  if (id && !product) return <Navigate to="/inventory/products" replace />;

  return (
    <div>
      <PageHeader
        title={product ? 'Edit Product' : 'Create Product'}
        description="Capture product identity, taxation, prices, opening stock, reorder controls, image placeholder, and status."
      />
      <ProductForm
        initialProduct={product}
        onCancel={() => navigate('/inventory/products')}
        onSubmit={(draft) => {
          if (product) {
            inventory.updateProduct(product.id, draft);
            navigate('/inventory/products');
            return;
          }
          inventory.createProduct(draft);
          navigate('/inventory/products');
        }}
      />
    </div>
  );
};

export default ProductFormPage;
