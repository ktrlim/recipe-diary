import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Layout/Header';
import RecipeList from './components/Recipe/RecipeList';
import AddRecipeForm from './components/Recipe/AddRecipeForm';
import AccountPage from './components/Account/AccountPage';
import AuthPage from './components/Auth/AuthPage';
import { useRecipes } from './hooks/useRecipes';
import { useAuth } from './hooks/useAuth';
import { Recipe } from './types/Recipe';

function App() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'add' | 'account'>('recipes');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { recipes, addRecipe, updateRecipe, deleteRecipe, importRecipes, exportRecipes, clearAllRecipes } = useRecipes();
  const { user, loading, signUp, signIn, signOut, signInWithGoogle, isAuthenticated } = useAuth();

  const handleAddRecipe = (formData: RecipeFormData) => {
  return addRecipe(formData).then(() => {
    setActiveTab('recipes');
  });
};

const handleUpdateRecipe = (formData: RecipeFormData) => {
  if (editingRecipe) {
    return updateRecipe(editingRecipe.id, formData).then(() => {
      setActiveTab('recipes');
      setEditingRecipe(null);
    });
  }
  return Promise.resolve();
};

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setActiveTab('recipes');
  }

  const handleSignUp = async (email: string, password: string, name?: string) => {
    await signUp(email, password, name);
  };

  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('recipes');
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        recipeCount={recipes.length}
      />
      
      <main className="main-content">
        {activeTab === 'recipes' && (
          <RecipeList 
            recipes={recipes} 
            onDeleteRecipe={deleteRecipe}
            onEditRecipe={handleEditRecipe} 
          />
        )}
        {activeTab === 'add' && (
          <AddRecipeForm 
            // onAddRecipe={handleAddRecipe} 
            onAddRecipe={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
            editingRecipe={editingRecipe}
            onCancelEdit={handleCancelEdit}
          />
        )}
        {activeTab === 'account' && (
          isAuthenticated ? (
            <AccountPage 
              recipeCount={recipes.length}
              onExportRecipes={exportRecipes}
              onImportRecipes={importRecipes}
              onClearAllRecipes={clearAllRecipes}
              user={user}
              onSignOut={handleSignOut}
            />
          ) : (
            <AuthPage 
              onSignUp={handleSignUp}
              onSignIn={handleSignIn}
              onGoogleSignIn={handleGoogleSignIn}
              loading={loading}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;