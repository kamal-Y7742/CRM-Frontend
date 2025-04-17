import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import '../assets/CSS/Profile.css';
import defaultAvatar from '../assets/Img/Avtar.jpg';
import ThemeSwitcher from '../Component/ThemeSwitcher';
import '../assets/CSS/ThemeSwitcher.css';

function Profile() {
  const [user, setUser] = useState({
    firstName: 'Kamal',
    lastName: 'Yadav',
    email: 'kamal.yadav@example.com',
    phone: '+91 85958 05398',
    role: 'Sales Manager',
    department: 'Sales',
    location: 'Gurugram, India',
    bio: 'Experienced sales manager with over 7 years in the CRM industry. Passionate  about building client relationships and driving team success.',
    joinDate: 'June 2021',
    skills: ['CRM Management', 'Sales Strategy', 'Team Leadership', 'Client Acquisition'],
    socialLinks: {
      linkedin: 'linkedin.com/in/kamal-yadav-613010249',
      twitter: 'twitter.com/kamalyadav',
    }
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selection via file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageFile(file);
  };

  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Process image file
  const handleImageFile = (file) => {
    setImageError(null);
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setImageError('Please select an image file (png, jpg, jpeg)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file size must be less than 5MB');
      return;
    }
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle profile information update
  const handleUserUpdate = (e) => {
    e.preventDefault();
    setSuccessMessage('Profile information updated successfully!');
    setTimeout(() => {
      setSuccessMessage(null);
      setIsEditing(false);
    }, 3000);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Container className="py-4 profile-container "  id='theme'>
      {successMessage && (
        <Alert variant="success" className="mb-4 animated fadeIn">
          {successMessage}
        </Alert>
      )}
      
      <Row className="g-4 " >
        {/* Left column - Profile image and main info */}
        <Col lg={4}>
          <Card className="profile-card shadow-sm">
            <Card.Body className="text-center">
              <div 
                className={`profile-image-container mb-4 ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="profile-image img-fluid rounded-circle"
                />
                <div className="profile-image-overlay">
                  <i className="bi bi-camera"></i>
                  <span>Change Photo</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*" 
                  onChange={handleImageChange}
                />
              </div>
              
              {imageError && (
                <Alert variant="danger" className="mt-2 mb-3 small py-2">
                  {imageError}
                </Alert>
              )}
              
              <h4>{user.firstName} {user.lastName}</h4>
              <p className="text-muted">{user.role}</p>
              
              <div className="profile-stats d-flex justify-content-around my-4">
                <div className="text-center">
                  <h5>253</h5>
                  <small className="text-muted">Deals</small>
                </div>
                <div className="text-center">
                  <h5>$1.2M</h5>
                  <small className="text-muted">Revenue</small>
                </div>
                <div className="text-center">
                  <h5>84%</h5>
                  <small className="text-muted">Conversion</small>
                </div>
              </div>
              
              <div className="profile-contact mb-4">
                <p className="mb-1">
                  <i className="bi bi-envelope me-2"></i> {user.email}
                </p>
                <p className="mb-1">
                  <i className="bi bi-telephone me-2"></i> {user.phone}
                </p>
                <p className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i> {user.location}
                </p>
              </div>
              
              <div className="profile-social mb-4">
                <a href={`https://${user.socialLinks.linkedin}`} className="btn btn-outline-primary btn-sm me-2">
                  <i className="bi bi-linkedin me-1"></i> LinkedIn
                </a>
                <a href={`https://${user.socialLinks.twitter}`} className="btn btn-outline-info btn-sm">
                  <i className="bi bi-twitter me-1"></i> Twitter
                </a>
              </div>
              
              <div className="profile-join-date text-muted small">
                <i className="bi bi-calendar-check me-1"></i> Member since {user.joinDate}
              </div>
            </Card.Body>
          </Card>
          
          <Card className="profile-card shadow-sm mt-4">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Skills & Expertise</h5>
            </Card.Header>
            <Card.Body>
              <div className="skills-container">
                {user.skills.map((skill, index) => (
                  <Badge key={index} bg="primary" className="skill-badge me-2 mb-2">{skill}</Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right column - Profile details and forms */}
        <Col lg={8}>
          <Card className="profile-card shadow-sm mb-4">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              <Button 
                variant={isEditing ? "btn-secondary" : "btn-outline-primary"} 
                size="sm"
                onClick={toggleEditMode} className='btn-primary'
              >
                {isEditing ? (
                  <><i className="bi bi-x-circle me-2"></i>Cancel</>
                ) : (
                  <><i className="bi bi-pencil me-2"></i>Edit Profile</>
                )}
              </Button>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUserUpdate}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={user.firstName}
                        onChange={(e) => setUser({...user, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={user.lastName}
                        onChange={(e) => setUser({...user, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={user.phone}
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Role/Position</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={user.role}
                        onChange={(e) => setUser({...user, role: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Department</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={user.department}
                        onChange={(e) => setUser({...user, department: e.target.value})}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={user.location}
                    onChange={(e) => setUser({...user, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={user.bio}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                    disabled={!isEditing}
                  />
                </Form.Group>
                
                {isEditing && (
                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="primary">
                      <i className="bi bi-check-circle me-2"></i>
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
          
          <Row className="g-4">
            <Col md={6}>
              <Card className="profile-card shadow-sm h-100">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">Performance Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="performance-metric mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Deal Conversion Rate</span>
                      <span className="text-primary">72%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                  
                  <div className="performance-metric mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Customer Satisfaction</span>
                      <span className="text-success">90%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: '90%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                  
                  <div className="performance-metric mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Target Achievement</span>
                      <span className="text-info">83%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: '83%' }} aria-valuenow="83" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                  
                  <div className="performance-metric">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Follow-up Rate</span>
                      <span className="text-warning">65%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-warning" role="progressbar" style={{ width: '65%' }} aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="profile-card shadow-sm h-100">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">Account Settings</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select defaultValue="en">
                      <option value="en">English (US)</option>
                      <option value="en-uk">English (UK)</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Time Zone</Form.Label>
                    <Form.Select defaultValue="ist">
                      <option value="ist">Indian Standard Time (GMT+5:30)</option>
                      <option value="pst">Pacific Standard Time (GMT-8)</option>
                      <option value="est">Eastern Standard Time (GMT-5)</option>
                      <option value="utc">Coordinated Universal Time (UTC)</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <div className="notification-settings mt-4">
                    <h6 className="mb-3">Notification Preferences</h6>
                    
                    <Form.Check 
                      type="switch"
                      id="email-notif"
                      label="Email Notifications"
                      defaultChecked
                      className="mb-2"
                    />
                    
                    <Form.Check 
                      type="switch"
                      id="sms-notif"
                      label="SMS Notifications"
                      className="mb-2"
                    />
                    
                    <Form.Check 
                      type="switch"
                      id="app-notif"
                      label="In-app Notifications"
                      defaultChecked
                      className="mb-2"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;