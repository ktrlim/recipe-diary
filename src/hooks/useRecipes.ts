import { useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (error) {
        console.error('Error loading recipes from localStorage:', error);
      }
    }
  }, []);

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'dateAdded'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    setRecipes(prev => [newRecipe, ...prev]);
    return Promise.resolve(newRecipe);
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    return Promise.resolve();
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
    return Promise.resolve();
  };

  const importRecipes = (importedRecipes: Recipe[]) => {
    // Add imported recipes with new IDs to avoid conflicts
    const recipesWithNewIds = importedRecipes.map(recipe => ({
      ...recipe,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString()
    }));
    setRecipes(prev => [...recipesWithNewIds, ...prev]);
    return Promise.resolve();
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

  const clearAllRecipes = () => {
    setRecipes([]);
    return Promise.resolve();
  };

  return {
    recipes,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    importRecipes,
    exportRecipes,
    clearAllRecipes
  };
};