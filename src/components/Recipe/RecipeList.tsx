import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Badge, Card } from 'react-bootstrap';
import { Search, Filter } from 'lucide-react';
import { Recipe } from '../../types/Recipe';
import RecipeCard from './RecipeCard';
import CustomDropdown from '../UI/CustomDropdown';

interface RecipeListProps {
  recipes: Recipe[];
  onDeleteRecipe: (id: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onDeleteRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMealType = !selectedMealType || recipe.mealType === selectedMealType;
      const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
      
      return matchesSearch && matchesMealType && matchesCuisine;
    });
  }, [recipes, searchTerm, selectedMealType, selectedCuisine]);

  const availableCuisines = useMemo(() => {
    const cuisines = recipes.map(r => r.cuisine).filter(Boolean);
    return [...new Set(cuisines)];
  }, [recipes]);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer'];

  const mealTypeOptions = [
    { value: '', label: 'All Meal Types' },
    ...mealTypes.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }))
  ];

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
    ...availableCuisines.map(cuisine => ({
      value: cuisine,
      label: cuisine
    }))
  ];

  return (
    <Container fluid className="py-4 fade-in-up">
      <div className="search-filter-section">
        <Row className="align-items-end">
          <Col md={6} className="mb-3">
            <Form.Label>Search Recipes</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          
          <Col md={3} className="mb-3">
            <Form.Label>Meal Type</Form.Label>
            <CustomDropdown
              options={mealTypeOptions}
              value={selectedMealType}
              onChange={setSelectedMealType}
              placeholder="All Meal Types"
            />
          </Col>
          
          <Col md={3} className="mb-3">
            <Form.Label>Cuisine</Form.Label>
            <CustomDropdown
              options={cuisineOptions}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
              placeholder="All Cuisines"
            />
          </Col>
        </Row>
      </div>

      <Row className="mb-3">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0 text-dark">
              <Filter size={20} className="me-2" style={{ color: 'var(--cookbook-red)' }} />
              Your Recipes
            </h4>
            <Badge className="custom-badge fs-6 px-3 py-2">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </Col>
      </Row>

      {filteredRecipes.length === 0 ? (
        <Row>
          <Col>
            <div className="empty-state">
              <h5>No recipes found</h5>
              <p>Try adjusting your search terms or add some new recipes!</p>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          {filteredRecipes.map(recipe => (
            <Col key={recipe.id} lg={4} md={6} className="mb-4 slide-in-right">
              <RecipeCard 
                recipe={recipe} 
                onDelete={onDeleteRecipe}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RecipeList;