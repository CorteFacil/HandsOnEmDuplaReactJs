// src/pages/ProductPage.jsx
import { useQuery } from '@tanstack/react-query';
import CardsGrid from "@components/CardsGrid";
import productService from '@services/productService';

const ProductPage = ({ onAddToCart }) => {
  const {
    data: productsByCategory,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['productsByCategory'],
    queryFn: () => productService.getProductsByCategory(),
  });

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando produtos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        Erro ao carregar produtos: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Nossos Produtos</h1>
      
      {productsByCategory.map(category => (
        <div key={category.id} className="mb-5">
          <h2 className="h3 mb-4">{category.name}</h2>
          {category.products.length === 0 ? (
            <p className="text-muted">Nenhum produto nesta categoria.</p>
          ) : (
            <CardsGrid
              items={category.products}
              cols={4}
              onAddToCart={onAddToCart}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
