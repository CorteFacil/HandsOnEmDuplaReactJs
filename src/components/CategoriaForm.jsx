import { useState, useEffect } from "react";

const CategoriaForm = ({ onSubmit, initialValue = "", isEditing }) => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    setNome(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim() === "") return;
    onSubmit(nome);
    setNome("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="nome" className="text-sm font-medium text-gray-700">
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da categoria"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={nome.trim() === ""}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 flex items-center ${
              nome.trim() === ""
                ? "bg-gray-400 cursor-not-allowed"
                : isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isEditing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Atualizar
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoriaForm;
