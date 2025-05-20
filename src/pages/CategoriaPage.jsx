import { useEffect, useState } from "react";
import CategoriaForm from "../components/CategoriaForm";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../services/categoryService";
import { toast } from "react-hot-toast";

const CategoriaPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error.message);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const salvarCategoria = async (nomeCategoria) => {
    try {
      let novaCategoria;
      if (editando !== null) {
        const categoria = categorias[editando];
        novaCategoria = await updateCategory(categoria.id, nomeCategoria);
        setCategorias(prev => prev.map(cat => 
          cat.id === novaCategoria.id ? novaCategoria : cat
        ));
        toast.success("Categoria atualizada com sucesso!");
        setEditando(null);
      } else {
        novaCategoria = await addCategory(nomeCategoria);
        setCategorias(prev => [...prev, novaCategoria]);
        toast.success("Categoria adicionada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error.message);
      toast.error(error.message || "Erro ao salvar categoria");
    }
  };

  const editarCategoria = (index) => {
    setEditando(index);
  };

  const excluirCategoria = async (index) => {
    try {
      const categoria = categorias[index];
      await deleteCategory(categoria.id);
      setCategorias(prev => prev.filter(cat => cat.id !== categoria.id));
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error.message);
      toast.error(error.message || "Erro ao excluir categoria");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            Gerenciamento de Categorias
          </h2>

          <CategoriaForm
            onSubmit={salvarCategoria}
            initialValue={editando !== null ? categorias[editando]?.name : ""}
            isEditing={editando !== null}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Lista de Categorias
          </h3>

          {categorias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                Nenhuma categoria encontrada.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categorias.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-700">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editarCategoria(idx)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => excluirCategoria(idx)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriaPage;
