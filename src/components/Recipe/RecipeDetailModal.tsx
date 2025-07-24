import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { Clock, Users, ExternalLink, X, ChefHat, Tag } from 'lucide-react';
import { Recipe } from '../../types/Recipe';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  show: boolean;
  onHide: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, show, onHide }) => {
  if (!recipe) return null;

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
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="recipe-detail-modal"
    >
      <Modal.Header className="border-0 pb-0">
        <Button
          variant="link"
          onClick={onHide}
          className="ms-auto p-0 text-muted"
          style={{ fontSize: '1.5rem', textDecoration: 'none' }}
        >
          <X size={24} />
        </Button>
      </Modal.Header>
      
      <Modal.Body className="pt-0">
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <ChefHat size={32} className="me-2" style={{ color: 'var(--charcoal)' }} />
            <h2 className="mb-0" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--charcoal)' }}>
              {recipe.title}
            </h2>
          </div>
          
          {recipe.mealType && (
            <Badge 
              className="mb-3"
              style={{
                background: getMealTypeColor(recipe.mealType),
                color: 'white',
                textTransform: 'capitalize',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '20px'
              }}
            >
              {recipe.mealType}
            </Badge>
          )}
        </div>

        {recipe.imageUrl && (
          <div className="text-center mb-4">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title}
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <Row className="mb-4">
          <Col md={6}>
            {recipe.author && (
              <p className="mb-2">
                <strong>Author:</strong> {recipe.author}
              </p>
            )}
            {recipe.cuisine && (
              <p className="mb-2">
                <strong>Cuisine:</strong> {recipe.cuisine}
              </p>
            )}
          </Col>
          <Col md={6}>
            <div className="d-flex flex-wrap gap-3">
              {recipe.prepTime && (
                <div className="d-flex align-items-center text-muted">
                  <Clock size={16} className="me-1" />
                  <small>Prep: {recipe.prepTime}m</small>
                </div>
              )}
              {recipe.cookTime && (
                <div className="d-flex align-items-center text-muted">
                  <Clock size={16} className="me-1" />
                  <small>Cook: {recipe.cookTime}m</small>
                </div>
              )}
              {recipe.servings && (
                <div className="d-flex align-items-center text-muted">
                  <Users size={16} className="me-1" />
                  <small>Serves: {recipe.servings}</small>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-4">
            <h5 className="d-flex align-items-center mb-3">
              <Tag size={18} className="me-2" />
              Tags
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  className="tag-badge"
                  style={{
                    background: 'rgba(44, 44, 44, 0.1)',
                    color: 'var(--charcoal)',
                    border: '1px solid rgba(44, 44, 44, 0.2)',
                    borderRadius: '15px',
                    padding: '0.4rem 0.8rem'
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Row>
          <Col md={6}>
            <h5 className="mb-3" style={{ color: 'var(--charcoal)', fontFamily: 'Playfair Display, serif' }}>
              Ingredients
            </h5>
            <ul className="list-unstyled">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-2 d-flex align-items-start">
                  <span 
                    className="me-2 mt-1"
                    style={{ 
                      width: '6px', 
                      height: '6px', 
                      backgroundColor: 'var(--charcoal)', 
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  ></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </Col>
          
          <Col md={6}>
            <h5 className="mb-3" style={{ color: 'var(--charcoal)', fontFamily: 'Playfair Display, serif' }}>
              Instructions
            </h5>
            <ol className="ps-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="mb-3" style={{ lineHeight: '1.6' }}>
                  {instruction}
                </li>
              ))}
            </ol>
          </Col>
        </Row>

        {recipe.sourceUrl && (
          <div className="text-center mt-4 pt-3 border-top">
            <Button 
              variant="outline-primary"
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center justify-content-center mx-auto"
              style={{ width: 'fit-content' }}
            >
              <ExternalLink size={16} className="me-2" />
              View Original Recipe
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RecipeDetailModal;