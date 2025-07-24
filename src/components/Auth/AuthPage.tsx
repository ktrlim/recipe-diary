import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onSignUp: (email: string, password: string, name?: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignUp, onSignIn, loading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      if (isSignUp) {
        await onSignUp(formData.email, formData.password, formData.name || undefined);
      } else {
        await onSignIn(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <Container fluid className="py-4 fade-in-up">
      <Row className="justify-content-center">
        <Col lg={6} xl={4}>
          <Card>
            <Card.Header className="text-center">
              <h3 className="mb-0 d-flex align-items-center justify-content-center">
                <User size={24} className="me-2" />
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-muted mt-2 mb-0">
                {isSignUp 
                  ? 'Join Recipe Diary to save your favorite recipes' 
                  : 'Sign in to access your recipe collection'
                }
              </p>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {isSignUp && (
                  <Form.Group className="mb-3">
                    <Form.Label>Name (Optional)</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        disabled={loading}
                      />
                      <User 
                        size={18} 
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                      />
                    </div>
                  </Form.Group>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      disabled={loading}
                    />
                    <Mail 
                      size={18} 
                      className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 end-0 translate-middle-y p-0 me-3 text-muted border-0"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  {isSignUp && (
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters long
                    </Form.Text>
                  )}
                </Form.Group>
                
                {isSignUp && (
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                      />
                      <Lock 
                        size={18} 
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                      />
                    </div>
                  </Form.Group>
                )}
                
                <div className="d-grid gap-3">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={toggleMode}
                    disabled={loading}
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign In' 
                      : "Don't have an account? Sign Up"
                    }
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-muted small">
              Your data is stored locally in your browser. No personal information is sent to external servers.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;