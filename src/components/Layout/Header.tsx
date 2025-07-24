import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { ChefHat, BookOpen, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  recipeCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, recipeCount }) => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <ChefHat className="me-2" size={32} />
          <span>Recipe Diary</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              active={activeTab === 'recipes'}
              onClick={() => onTabChange('recipes')}
              className="d-flex align-items-center"
            >
              <BookOpen className="me-2" size={16} />
              My Recipes
              <Badge className="custom-badge">
                {recipeCount}
              </Badge>
            </Nav.Link>
            
            <Nav.Link
              active={activeTab === 'add'}
              onClick={() => onTabChange('add')}
            >
              + Add Recipe
            </Nav.Link>
            
            <Nav.Link
              active={activeTab === 'account'}
              onClick={() => onTabChange('account')}
              className="d-flex align-items-center"
            >
              <User className="me-2" size={16} />
              Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;