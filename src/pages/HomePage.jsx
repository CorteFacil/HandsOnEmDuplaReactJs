import { useQuery } from '@tanstack/react-query';
import CardsGrid from "@components/CardsGrid";
import productService from '@services/productService';

const HomePage = ({ onAddToCart }) => {
  const { data: productsByCategory, isLoading, isError } = useQuery({
    queryKey: ['productsByCategory'],
    queryFn: () => productService.getProductsByCategory(),
  });

  return (
    <div>
      <h1>Bem-vindo à Nossa Loja!</h1>
      <p>Confira nossos produtos por categoria:</p>
      
      {isLoading ? (
        <p>Carregando produtos...</p>
      ) : isError ? (
        <p>Erro ao carregar produtos.</p>
      ) : (
        <>
          {productsByCategory.map(category => {
            // Pegar apenas os 3 primeiros produtos de cada categoria
            const featuredProducts = category.products.slice(0, 3);
            
            if (featuredProducts.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-5">
                <CardsGrid
                  title={category.name}
                  items={featuredProducts}
                  cols={3}
                  onAddToCart={onAddToCart}
                />
              </div>
            );
          })}

          <div className="mt-4 text-center">
            <a href="/produtos" className="btn btn-primary">
              Ver todos os produtos
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
