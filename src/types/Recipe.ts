export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  totalTime?: number; // calculated from prep + cook
  servings?: number;
  imageUrl?: string;
  sourceUrl?: string;
  tags?: string[];
  author?: string;
  cuisine?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'appetizer';
  dateAdded: string;
}

export interface RecipeFormData {
  title: string;
  ingredients: string;
  instructions: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  imageUrl: string;
  sourceUrl: string;
  tags: string;
  author: string;
  cuisine: string;
  mealType: string;
}