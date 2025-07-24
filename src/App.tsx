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

function App() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'add' | 'account'>('recipes');
  const { recipes, addRecipe, deleteRecipe, importRecipes, exportRecipes, clearAllRecipes } = useRecipes();
  const { user, loading, signUp, signIn, signOut, isAuthenticated } = useAuth();

  const handleAddRecipe = (recipe: any) => {
    return addRecipe(recipe).then(() => {
      setActiveTab('recipes');
    });
  };

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
          />
        )}
        {activeTab === 'add' && (
          <AddRecipeForm onAddRecipe={handleAddRecipe} />
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
              loading={loading}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;