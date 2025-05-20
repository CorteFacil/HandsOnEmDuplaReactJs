import supabase from './supabase';

const productService = {
  async getProductsByPage(page = 1, limit = 12) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*, categories(name)', { count: 'exact' })
      .range(from, to)
      .order('title', { ascending: true });
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
    return { 
      products: data, 
      total: count,
      totalPages: Math.ceil(count / limit)
    };
  },

  async getProductsByCategory() {
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    if (!categories) {
      throw new Error('Erro ao buscar categorias');
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('title', { ascending: true });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }

    // Agrupar produtos por categoria
    const productsByCategory = categories.map(category => ({
      ...category,
      products: products.filter(product => product.category_id === category.id)
    }));

    return productsByCategory;
  },
  
  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
    return data;
  },
  
  async createProduct(product) {
    const price = parseFloat(product.price);
    const category_id = parseInt(product.category_id);

    const { error } = await supabase
      .from('products')
      .insert({
        title: product.title,
        description: product.description,
        price: price,
        image_url: product.image_url,
        category_id: category_id
      });

    if (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }

    return {
      title: product.title,
      description: product.description,
      price: price,
      image_url: product.image_url,
      category_id: category_id
    };
  },
  
  async updateProduct(id, product) {
    const price = parseFloat(product.price);
    const category_id = parseInt(product.category_id);

    const { error } = await supabase
      .from('products')
      .update({
        title: product.title,
        description: product.description,
        price: price,
        image_url: product.image_url,
        category_id: category_id
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }

    return {
      id,
      title: product.title,
      description: product.description,
      price: price,
      image_url: product.image_url,
      category_id: category_id
    };
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);    
    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
    return true;
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};

export default productService;