import supabase from "./supabase";

export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const addCategory = async (name) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateCategory = async (id, name) => {
  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
};