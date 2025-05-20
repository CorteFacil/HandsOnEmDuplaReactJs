// src/services/profileService.js
import supabase from '@services/supabase';

const profileService = {
    async getProfile() {
        // Obter o usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');
        
        // Buscar o perfil do usuário atual
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (error) {
            // Se o perfil não existir, retornar um perfil vazio
            if (error.code === 'PGRST116') {
                return {
                    id: user.id,
                    full_name: user.user_metadata?.full_name || '',
                    phone: '',
                    avatar_url: 'https://placehold.co/40?text=A'
                };
            }
            throw error;
        }
        if (data.avatar_url) {
            // Obtém a URL pública do avatar diretamente
            data.avatar_url = supabase.storage.from('avatars').getPublicUrl(data.avatar_url).data.publicUrl;
        } else {
            // Caso o usuário não tenha avatar, atribui o placeholder
            data.avatar_url = 'https://placehold.co/40?text=A';
        }
        return data;
    },

    async updateProfile({ full_name, phone, file }) {
        try {
            // Obter o usuário atual
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            let avatar_url = null;
            
            // Upload do novo avatar se um arquivo foi fornecido
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

                // Primeiro, fazer o upload do arquivo
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(`public/${fileName}`, file, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: file.type
                    });

                if (uploadError) {
                    console.error('Detalhes do erro no upload:', uploadError);
                    throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
                }

                avatar_url = `public/${fileName}`;

                // Verificar se o upload foi bem-sucedido
                const { data: checkData } = await supabase.storage
                    .from('avatars')
                    .getPublicUrl(avatar_url);

                if (!checkData?.publicUrl) {
                    throw new Error('Erro ao gerar URL pública para o avatar');
                }
            }

            // Atualizar metadados do usuário
            const { error: userUpdateError } = await supabase.auth.updateUser({
                data: { full_name }
            });

            if (userUpdateError) throw userUpdateError;

            // Verificar se o perfil existe
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', user.id)
                .single();

            // Se tiver um novo avatar, deletar o antigo
            if (avatar_url && existingProfile?.avatar_url) {
                try {
                    await supabase.storage
                        .from('avatars')
                        .remove([existingProfile.avatar_url]);
                } catch (deleteError) {
                    console.error('Erro ao deletar avatar antigo:', deleteError);
                }
            }

            // Preparar dados para atualização
            const updates = {
                id: user.id,
                full_name,
                phone,
                updated_at: new Date().toISOString()
            };

            // Só incluir avatar_url se um novo arquivo foi enviado
            if (avatar_url) {
                updates.avatar_url = avatar_url;
            }

            // Atualizar ou criar perfil
            const { data, error } = await supabase
                .from('profiles')
                .upsert(updates, {
                    onConflict: 'id'
                })
                .select()
                .single();

            if (error) {
                console.error('Erro na atualização do perfil:', error);
                throw error;
            }

            // Retornar dados com URL pública do avatar
            if (data.avatar_url) {
                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(data.avatar_url);
                data.avatar_url = urlData.publicUrl;
            }

            return data;
        } catch (error) {
            console.error('Erro completo na atualização do perfil:', error);
            throw error;
        }
    },

    getAvatarUrl(avatar) {
        return avatar
            ? supabase.storage.from('avatars').getPublicUrl(avatar).data.publicUrl
            : 'https://placehold.co/40?text=A';
    },
};

export default profileService;