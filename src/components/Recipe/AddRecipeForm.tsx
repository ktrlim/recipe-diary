import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Plus, Link, Save } from 'lucide-react';
import { Recipe, RecipeFormData } from '../../types/Recipe';
import CustomDropdown from '../UI/CustomDropdown';

interface AddRecipeFormProps {
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'dateAdded'>) => void;
}

const AddRecipeForm: React.FC<AddRecipeFormProps> = ({ onAddRecipe }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState('');
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    imageUrl: '',
    sourceUrl: '',
    tags: '',
    author: '',
    cuisine: '',
    mealType: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      ingredients: '',
      instructions: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      imageUrl: '',
      sourceUrl: '',
      tags: '',
      author: '',
      cuisine: '',
      mealType: ''
    });
    setImportUrl('');
    setError(null);
    setSuccess(null);
  };

  const mealTypeOptions = [
    { value: '', label: 'Select meal type...' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'snack', label: 'Snack' },
    { value: 'appetizer', label: 'Appetizer' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!formData.title.trim() || !formData.ingredients.trim() || !formData.instructions.trim()) {
      setError('Title, ingredients, and instructions are required.');
      setLoading(false);
      return;
    }

    try {
      const recipe: Omit<Recipe, 'id' | 'dateAdded'> = {
        title: formData.title.trim(),
        ingredients: formData.ingredients.split('\n').filter(ing => ing.trim()),
        instructions: formData.instructions.split('\n').filter(inst => inst.trim()),
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
        cookTime: formData.cookTime ? parseInt(formData.cookTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        sourceUrl: formData.sourceUrl.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        author: formData.author.trim() || undefined,
        cuisine: formData.cuisine.trim() || undefined,
        mealType: formData.mealType as Recipe['mealType'] || undefined
      };

      await onAddRecipe(recipe);
      setSuccess('Recipe added successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
      console.error('Error saving recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // This is a placeholder for web scraping functionality
      // In a real app, you'd call your backend API that handles web scraping
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // For now, we'll just populate the form with the URL in the source field
      setFormData(prev => ({
        ...prev,
        sourceUrl: importUrl,
        title: 'Imported Recipe',
        ingredients: 'Please edit the imported ingredients',
        instructions: 'Please edit the imported instructions'
      }));
      
      setActiveTab('manual');
      setSuccess('Recipe imported! Please review and edit the details below.');
    } catch (err) {
      setError('Failed to import recipe. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4 fade-in-up">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-center">
                <Button
                  variant={activeTab === 'manual' ? 'danger' : 'outline-danger'}
                  onClick={() => setActiveTab('manual')}
                  className="me-2"
                >
                  <Plus size={16} className="me-1" />
                  Add Manually
                </Button>
                <Button
                  variant={activeTab === 'import' ? 'danger' : 'outline-danger'}
                  onClick={() => setActiveTab('import')}
                >
                  <Link size={16} className="me-1" />
                  Import from URL
                </Button>
              </div>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              {success && <Alert variant="success" className="mb-3">{success}</Alert>}
              
              {activeTab === 'import' && (
                <div className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Recipe URL</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="url"
                        placeholder="https://example.com/recipe"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        variant="primary"
                        onClick={handleImportFromUrl}
                        disabled={loading || !importUrl.trim()}
                        variant="primary"
                      >
                        {loading ? <Spinner size="sm" /> : 'Import'}
                      </Button>
                    </div>
                  </Form.Group>
                  <Alert variant="info" className="small">
                    <strong>Note:</strong> URL import functionality is a placeholder. In a real app, this would extract recipe data from the provided URL.
                  </Alert>
                </div>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Recipe Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter recipe title"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Recipe author"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cuisine</Form.Label>
                      <Form.Control
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        placeholder="e.g., Italian, Mexican, Asian"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prep Time (min)</Form.Label>
                      <Form.Control
                        type="number"
                        name="prepTime"
                        value={formData.prepTime}
                        onChange={handleInputChange}
                        placeholder="15"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cook Time (min)</Form.Label>
                      <Form.Control
                        type="number"
                        name="cookTime"
                        value={formData.cookTime}
                        onChange={handleInputChange}
                        placeholder="30"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Servings</Form.Label>
                      <Form.Control
                        type="number"
                        name="servings"
                        value={formData.servings}
                        onChange={handleInputChange}
                        placeholder="4"
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Meal Type</Form.Label>
                      <CustomDropdown
                        options={mealTypeOptions}
                        value={formData.mealType}
                        onChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}
                        placeholder="Select meal type..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Ingredients *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    placeholder="Enter each ingredient on a new line&#10;e.g.:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Instructions *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    placeholder="Enter each instruction step on a new line&#10;e.g.:&#10;Preheat oven to 350°F&#10;Mix dry ingredients in a bowl&#10;Add wet ingredients and stir"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Source URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/original-recipe"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="vegetarian, quick, healthy (separate with commas)"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetForm}
                    type="button"
                  >
                    Clear Form
                  </Button>
                  <Button 
                    variant="danger" 
                    type="submit"
                  >
                    <Save size={16} className="me-1" />
                    Save Recipe
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRecipeForm;