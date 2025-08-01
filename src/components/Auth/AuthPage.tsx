import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onSignUp: (email: string, password: string, name?: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  loading: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignUp, onSignIn, onGoogleSignIn, loading }) => {
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

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleSignIn();
    } catch (err) {
      setError('Google sign-in failed.');
    }
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
                 
                  <div className="position-relative">
                    <hr className="my-3" />
                    <span 
                      className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted"
                      style={{ fontSize: '0.9rem' }}
                    >
                      or
                    </span>
                  </div>

                  <Button 
                    variant="outline-dark"
                    onClick={handleGoogleSignIn}
                    size="lg"
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      borderColor: '#dadce0',
                      color: '#3c4043',
                      backgroundColor: 'white',
                      fontWeight: '500'
                    }}
                  >
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      className="me-3"
                    >
                      <path 
                        fill="#4285F4" 
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path 
                        fill="#34A853" 
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path 
                        fill="#FBBC05" 
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path 
                        fill="#EA4335" 
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
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