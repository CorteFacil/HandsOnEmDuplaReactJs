// src/pages/auth/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import profileService from '@services/profileService';
import { useAuth } from '@contexts/AuthContext';

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

const ProfilePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileRef = useRef(null);
    const { user } = useAuth();

    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        avatar_file: null,
        avatar_preview: 'https://placehold.co/150?text=Avatar'
    });

    const [errors, setErrors] = useState({});

    // Buscar perfil do usuário
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: profileService.getProfile,
        enabled: !!user,
        staleTime: 0
    });

    // Atualizar formulário quando o perfil for carregado
    useEffect(() => {
        if (!profile) return;
        setForm(f => ({
            ...f,
            full_name: profile.full_name ?? '',
            phone: profile.phone ?? '',
            avatar_preview: profile.avatar_url || 'https://placehold.co/150?text=Avatar'
        }));
    }, [profile]);

    // Mutation para atualizar perfil
    const updateMutation = useMutation({
        mutationFn: profileService.updateProfile,
        onSuccess: (data) => {
            toast.success('Perfil atualizado com sucesso!', { icon: '✅' });
            // Atualizar cache do React Query
            queryClient.invalidateQueries(['profile']);
            // Atualizar preview com nova URL
            if (data.avatar_url) {
                setForm(prev => ({ ...prev, avatar_preview: data.avatar_url }));
            }
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar perfil: ${error.message}`, { icon: '❌' });
        }
    });

    // Handler para mudança de campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handler para seleção de arquivo
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione uma imagem válida', { icon: '❌' });
            return;
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('A imagem deve ter no máximo 5MB', { icon: '❌' });
            return;
        }

        setForm(prev => ({ ...prev, avatar_file: file }));

        // Criar preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            setForm(prev => ({ ...prev, avatar_preview: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    // Validação do formulário
    const validate = () => {
        const newErrors = {};
        if (!form.full_name.trim()) {
            newErrors.full_name = 'O nome é obrigatório';
        }
        if (form.phone && !phoneRegex.test(form.phone)) {
            newErrors.phone = 'Telefone inválido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler para submit do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        updateMutation.mutate({
            full_name: form.full_name.trim(),
            phone: form.phone,
            file: form.avatar_file
        });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
                <div className="card">
                    <div className="card-header text-bg-light py-3">
                        <h2 className="mb-0">Meu perfil</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Avatar */}
                            <div className="mb-4 text-center">
                                <img
                                    src={form.avatar_preview}
                                    alt="Avatar"
                                    className="rounded-circle mb-3 border"
                                    style={{
                                        width: 150,
                                        height: 150,
                                        objectFit: 'cover'
                                    }}
                                />
                                <br />
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => fileRef.current?.click()}
                                    disabled={updateMutation.isPending}>
                                    <i className="bi bi-camera me-2"></i>
                                    Alterar foto
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    ref={fileRef}
                                    onChange={handleFileSelect}
                                />
                                {form.avatar_file && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            Arquivo selecionado: {form.avatar_file.name}
                                        </small>
                                    </div>
                                )}
                            </div>

                            {/* Nome completo */}
                            <div className="mb-3">
                                <label htmlFor="full_name" className="form-label">Nome completo</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                                    id="full_name"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    disabled={updateMutation.isPending}
                                />
                                {errors.full_name && (
                                    <div className="invalid-feedback">{errors.full_name}</div>
                                )}
                            </div>

                            {/* Telefone */}
                            <div className="mb-4">
                                <label htmlFor="phone" className="form-label">Telefone</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="(99) 99999-9999"
                                    disabled={updateMutation.isPending}
                                />
                                {errors.phone && (
                                    <div className="invalid-feedback">{errors.phone}</div>
                                )}
                            </div>

                            {/* Botões */}
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Salvando...
                                        </>
                                    ) : (
                                        'Salvar alterações'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(-1)}
                                    disabled={updateMutation.isPending}>
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;