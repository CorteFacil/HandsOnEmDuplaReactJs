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
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-2">
        <label htmlFor="nome" className="form-label fw-medium">
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </label>
        <div className="d-flex gap-2">
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da categoria"
            className="form-control"
            aria-label="Nome da categoria"
          />
          <button
            type="submit"
            disabled={nome.trim() === ""}
            className={`btn ${
              nome.trim() === ""
                ? "btn-secondary disabled"
                : isEditing
                ? "btn-warning"
                : "btn-primary"
            } d-flex align-items-center`}
          >
            {isEditing ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil me-2"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708L13.207 5.793l-3-3L12.146.854zm-3 3l3 3L5.5 13.5H2.5v-3L9.146 3.854z" />
                </svg>
                Atualizar
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-lg me-2"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a.5.5 0 0 1 .5.5v4.5H13a.5.5 0 0 1 0 1H8.5v4.5a.5.5 0 0 1-1 0V9.5H3a.5.5 0 0 1 0-1h4.5V3.5A.5.5 0 0 1 8 3z"
                  />
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
