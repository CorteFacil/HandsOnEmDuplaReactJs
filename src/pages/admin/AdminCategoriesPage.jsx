import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@services/categoryService';

const AdminCategoriesPage = () => {
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const queryClient = useQueryClient();

    // Buscar categorias
    const { data: categories, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    // Adicionar categoria
    const addMutation = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setNewCategoryName('');
            toast.success('Categoria adicionada com sucesso!', { icon: '✅' });
        },
        onError: (error) => {
            toast.error(`Erro ao adicionar categoria: ${error.message}`, { icon: '❌' });
        }
    });

    // Atualizar categoria
    const updateMutation = useMutation({
        mutationFn: ({ id, name }) => updateCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setEditingCategory(null);
            toast.success('Categoria atualizada com sucesso!', { icon: '✅' });
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar categoria: ${error.message}`, { icon: '❌' });
        }
    });

    // Excluir categoria
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Categoria excluída com sucesso!', { icon: '🗑️' });
        },
        onError: (error) => {
            toast.error(`Erro ao excluir categoria: ${error.message}`, { icon: '❌' });
        }
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        addMutation.mutate(newCategoryName);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editingCategory?.name.trim()) return;
        updateMutation.mutate({
            id: editingCategory.id,
            name: editingCategory.name
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
    if (isError) return <div className="alert alert-danger">Erro ao carregar categorias.</div>;

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header text-bg-light">
                        <h2 className="mb-0">Categorias</h2>
                    </div>
                    <div className="card-body">
                        {/* Formulário para adicionar nova categoria */}
                        <form onSubmit={handleAdd} className="mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nova categoria"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={!newCategoryName.trim() || addMutation.isPending}>
                                    {addMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Adicionando...
                                        </>
                                    ) : 'Adicionar'}
                                </button>
                            </div>
                        </form>

                        {/* Lista de categorias */}
                        <div className="list-group">
                            {categories?.map(category => (
                                <div key={category.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    {editingCategory?.id === category.id ? (
                                        <form onSubmit={handleUpdate} className="d-flex gap-2 flex-grow-1">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                autoFocus
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-success btn-sm"
                                                disabled={updateMutation.isPending}>
                                                {updateMutation.isPending ? '...' : '✓'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingCategory(null)}>
                                                ✕
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <span>{category.name}</span>
                                            <div>
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => setEditingCategory(category)}>
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={deleteMutation.isPending}>
                                                    Excluir
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriesPage; 