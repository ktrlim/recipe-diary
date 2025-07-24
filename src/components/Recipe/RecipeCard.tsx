import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Clock, Users, Trash2, ExternalLink } from 'lucide-react';
import { Recipe } from '../../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onView: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onView }) => {
  const getMealTypeColor = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return 'linear-gradient(135deg, #FF7A7A, #FF6B6B)';
      case 'lunch': return 'linear-gradient(135deg, #87CEEB, #5DADE2)';
      case 'dinner': return 'linear-gradient(135deg, #8FBC8F, #6BCF7F)';
      case 'dessert': return 'linear-gradient(135deg, #FFB74D, #FF9800)';
      case 'snack': return 'linear-gradient(135deg, #BA68C8, #9C27B0)';
      case 'appetizer': return 'linear-gradient(135deg, #FF8A65, #FF7043)';
      default: return 'linear-gradient(135deg, #6B6B6B, #555555)';
    }
  };

  return (
    <Card className="h-100 recipe-card" style={{ cursor: 'pointer' }}>
      <div className="position-relative">
        {recipe.imageUrl && (
          <Card.Img 
            variant="top" 
            src={recipe.imageUrl} 
            className="card-img-top"
            onClick={() => onView(recipe)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {recipe.mealType && (
          <Badge 
            className="position-absolute top-0 end-0 m-2"
            style={{
              background: getMealTypeColor(recipe.mealType),
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            {recipe.mealType}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column" onClick={() => onView(recipe)}>
        <Card.Title className="card-title">
          {recipe.title}
        </Card.Title>
        
        {recipe.cuisine && (
          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
        )}
        
        {recipe.author && (
          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            <strong>By:</strong> {recipe.author}
          </p>
        )}
        
        <div className="recipe-stats mb-3">
          {recipe.prepTime && (
            <div className="stat-item">
              <Clock size={14} />
              Prep: {recipe.prepTime}m
            </div>
          )}
          {recipe.cookTime && (
            <div className="stat-item">
              <Clock size={14} />
              Cook: {recipe.cookTime}m
            </div>
          )}
          {recipe.servings && (
            <div className="stat-item">
              <Users size={14} />
              Serves: {recipe.servings}
            </div>
          )}
        </div>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-3">
            {recipe.tags.map((tag, index) => (
              <Badge 
                key={index}
                className="tag-badge me-1 mb-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              {recipe.sourceUrl && (
                <Button 
                  variant="outline-primary"
                  size="sm"
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} className="me-1" />
                  Source
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe.id);
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;