// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import CardsGrid from "@components/CardsGrid";
import productService from '@services/productService';
import { getCategories } from '@services/categoryService';

const PRODUCTS_PER_PAGE = 8;

const ProductPage = ({ onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['products', currentPage],
    queryFn: () => productService.getProductsByPage(currentPage, PRODUCTS_PER_PAGE),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

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

  const { products, totalPages } = data;

  return (
    <div>
      <CardsGrid
        title="Todos os Produtos"
        items={products.map(produto => ({
          ...produto,
          categoria: categorias.find(cat => cat.id === produto.category_id)?.name || "Sem categoria"
        }))}
        cols={4}
        onAddToCart={onAddToCart}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductPage;
