import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { User, Settings, Download, Upload, Trash2, Save, LogOut } from 'lucide-react';

interface AccountPageProps {
  recipeCount: number;
  onExportRecipes: () => void;
  onImportRecipes: (recipes: any[]) => void;
  onClearAllRecipes: () => void;
  user: { id: string; email: string; name?: string } | null;
  onSignOut: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ 
  recipeCount, 
  onExportRecipes, 
  onImportRecipes, 
  onClearAllRecipes,
  user,
  onSignOut
}) => {
  const [profile, setProfile] = useState({
    name: user?.name || localStorage.getItem('userProfile_name') || '',
    email: user?.email || localStorage.getItem('userProfile_email') || '',
    bio: localStorage.getItem('userProfile_bio') || ''
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile_name', profile.name);
    localStorage.setItem('userProfile_email', profile.email);
    localStorage.setItem('userProfile_bio', profile.bio);
    setSuccess('Profile saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const recipes = JSON.parse(event.target?.result as string);
        if (Array.isArray(recipes)) {
          onImportRecipes(recipes);
          setSuccess(`Successfully imported ${recipes.length} recipes!`);
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('Invalid file format. Please upload a valid JSON file.');
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        setError('Error reading file. Please make sure it\'s a valid JSON file.');
        setTimeout(() => setError(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all recipes? This action cannot be undone.')) {
      onClearAllRecipes();
      setSuccess('All recipes have been cleared.');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <Container fluid className="py-4 fade-in-up">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          
          {/* Profile Section */}
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 d-flex align-items-center">
                  <User size={20} className="me-2" />
                  Profile Information
                </h4>
                <Button variant="outline-danger" size="sm" onClick={onSignOut}>
                  <LogOut size={16} className="me-1" />
                  Sign Out
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        placeholder="Your name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        placeholder="your.email@example.com"
                        disabled={!!user?.email}
                      />
                      {user?.email && (
                        <Form.Text className="text-muted">
                          Email cannot be changed after registration
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about your cooking journey..."
                  />
                </Form.Group>
                
                <Button variant="danger" onClick={handleSaveProfile}>
                  <Save size={16} className="me-1" />
                  Save Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Recipe Statistics */}
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0 d-flex align-items-center">
                <Settings size={20} className="me-2" />
                Recipe Statistics
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <div className="mb-3">
                    <h3 className="text-dark mb-1">{recipeCount}</h3>
                    <p className="text-muted mb-0">Total Recipes</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h3 className="text-dark mb-1">
                      {Math.round((localStorage.getItem('recipes')?.length || 0) / 1024)}KB
                    </h3>
                    <p className="text-muted mb-0">Storage Used</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h3 className="text-dark mb-1">
                      {new Date().toLocaleDateString()}
                    </h3>
                    <p className="text-muted mb-0">Last Updated</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Data Management */}
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0 d-flex align-items-center">
                <Settings size={20} className="me-2" />
                Data Management
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <h6 className="mb-1">Export Recipes</h6>
                    <p className="text-muted mb-0 small">Download all your recipes as a JSON file</p>
                  </div>
                  <Button variant="outline-primary" onClick={onExportRecipes}>
                    <Download size={16} className="me-1" />
                    Export
                  </Button>
                </div>
                
                <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <h6 className="mb-1">Import Recipes</h6>
                    <p className="text-muted mb-0 small">Upload a JSON file to import recipes</p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      style={{ display: 'none' }}
                      id="import-file"
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={() => document.getElementById('import-file')?.click()}
                    >
                      <Upload size={16} className="me-1" />
                      Import
                    </Button>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center p-3 border rounded border-danger">
                  <div>
                    <h6 className="mb-1 text-danger">Clear All Recipes</h6>
                    <p className="text-muted mb-0 small">Permanently delete all your recipes</p>
                  </div>
                  <Button variant="outline-danger" onClick={handleClearAll}>
                    <Trash2 size={16} className="me-1" />
                    Clear All
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* App Information */}
          <Card>
            <Card.Header>
              <h4 className="mb-0">About Recipe Diary</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Recipe Diary is your personal cookbook for storing and organizing your favorite recipes. 
                All data is stored locally in your browser.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="secondary">Version 1.0.0</Badge>
                <Badge bg="secondary">Local Storage</Badge>
                <Badge bg="secondary">No Account Required</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountPage;