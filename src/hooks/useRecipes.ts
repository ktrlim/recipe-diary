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
    if (!user) return; // Add this check
    
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id) // Changed from user?.id to user.id since we have the check above
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      setRecipes(data || []);
    }

    setLoading(false);
  };

  const addRecipe = async (recipeFormData: any) => {
    if (!user) throw new Error('User not authenticated');

    // Convert form strings to proper types for Supabase
    const supabaseRecipe = {
      title: recipeFormData.title,
      ingredients: recipeFormData.ingredients.split('\n').map((i: string) => i.trim()).filter((i: string) => i),
      instructions: recipeFormData.instructions.split('\n').map((i: string) => i.trim()).filter((i: string) => i),
      prep_time: recipeFormData.prepTime ? parseInt(recipeFormData.prepTime) : null,
      cook_time: recipeFormData.cookTime ? parseInt(recipeFormData.cookTime) : null,
      total_time: (recipeFormData.prepTime && recipeFormData.cookTime) 
        ? parseInt(recipeFormData.prepTime) + parseInt(recipeFormData.cookTime) 
        : null,
      servings: recipeFormData.servings ? parseInt(recipeFormData.servings) : null,
      image_url: recipeFormData.imageUrl || null,
      source_url: recipeFormData.sourceUrl || null,
      tags: recipeFormData.tags ? recipeFormData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
      author: recipeFormData.author || null,
      cuisine: recipeFormData.cuisine || null,
      meal_type: recipeFormData.mealType || null,
      user_id: user.id,
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
    if (!user) throw new Error('User not authenticated'); // Add this check
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Changed from user?.id to user.id

    if (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }

    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const updateRecipe = async (id: string, recipeFormData: any) => {
  if (!user) throw new Error('User not authenticated');
  
  // Convert form strings to proper types for Supabase (same as addRecipe)
  const supabaseRecipe = {
    title: recipeFormData.title,
    ingredients: recipeFormData.ingredients.split('\n').map((i: string) => i.trim()).filter((i: string) => i),
    instructions: recipeFormData.instructions.split('\n').map((i: string) => i.trim()).filter((i: string) => i),
    prep_time: recipeFormData.prepTime ? parseInt(recipeFormData.prepTime) : null,
    cook_time: recipeFormData.cookTime ? parseInt(recipeFormData.cookTime) : null,
    total_time: (recipeFormData.prepTime && recipeFormData.cookTime) 
      ? parseInt(recipeFormData.prepTime) + parseInt(recipeFormData.cookTime) 
      : null,
    servings: recipeFormData.servings ? parseInt(recipeFormData.servings) : null,
    image_url: recipeFormData.imageUrl || null,
    source_url: recipeFormData.sourceUrl || null,
    tags: recipeFormData.tags ? recipeFormData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
    author: recipeFormData.author || null,
    cuisine: recipeFormData.cuisine || null,
    meal_type: recipeFormData.mealType || null,
    // Don't include user_id in updates, it should stay the same
  };

  const { data, error } = await supabase
    .from('recipes')
    .update(supabaseRecipe)
    .eq('id', id)
    .eq('user_id', user.id)
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
    if (!user) throw new Error('User not authenticated');
    
    const prepared = importedRecipes.map(recipe => ({
      ...recipe,
      id: undefined,
      user_id: user.id, // Changed from user?.id to user.id
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
    if (!user) throw new Error('User not authenticated'); // Auth check
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('user_id', user.id); // Changed from user?.id to user.id

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