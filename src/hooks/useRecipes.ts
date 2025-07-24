import { useEffect, useState } from 'react';
import { Recipe } from '../types/Recipe';
import { supabase } from '../supabaseClient';
import { useAuth } from './useAuth';

export const useRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    if (user) fetchRecipes();
  }, [user]);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user?.id) // RLS enforced here
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      setRecipes(data || []);
    }

    setLoading(false);
  };

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'dateAdded'>) => {
  const supabaseRecipe = {
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    total_time: recipe.prepTime && recipe.cookTime ? recipe.prepTime + recipe.cookTime : null,
    servings: recipe.servings,
    image_url: recipe.imageUrl,
    source_url: recipe.sourceUrl,
    tags: recipe.tags,
    author: recipe.author,
    cuisine: recipe.cuisine,
    meal_type: recipe.mealType,
    user_id: user?.id,
  };

  const { data, error } = await supabase
    .from('recipes')
    .insert([supabaseRecipe])
    .select();

  if (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }

  const newRecipe = data?.[0];
  if (newRecipe) {
    setRecipes(prev => [newRecipe, ...prev]);
  }

  return newRecipe;
};

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id); // RLS enforced here

    if (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }

    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id) // RLS enforced here
      .select();

    if (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }

    const updated = data?.[0];
    if (updated) {
      setRecipes(prev =>
        prev.map(recipe => (recipe.id === id ? { ...recipe, ...updated } : recipe))
      );
    }

    return updated;
  };

  const importRecipes = async (importedRecipes: Recipe[]) => {
    const prepared = importedRecipes.map(recipe => ({
      ...recipe,
      id: undefined, // let Supabase assign ID
      user_id: user?.id,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('recipes')
      .insert(prepared)
      .select();

    if (error) {
      console.error('Error importing recipes:', error);
      throw error;
    }

    setRecipes(prev => [...(data || []), ...prev]);
  };

  const exportRecipes = () => {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipe-diary-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return Promise.resolve();
  };

  const clearAllRecipes = async () => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error clearing recipes:', error);
      throw error;
    }

    setRecipes([]);
  };

  return {
    recipes,
    loading,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    importRecipes,
    exportRecipes,
    clearAllRecipes,
  };
};