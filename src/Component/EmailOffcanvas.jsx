import React, { useState } from 'react';
import { Offcanvas, Form, Button, Tab, Nav, InputGroup } from 'react-bootstrap';
import { 
  FaTimes, FaChevronDown, FaPaperclip, FaSmile, FaPaperPlane, 
  FaAngleRight, FaAngleDown, FaUsers, FaUser, FaLock,
  FaIndent, FaArrowLeft, FaRedo, FaFont, FaList, FaListOl,
  FaQuoteRight, FaCode, FaLink, FaImage, FaFile, FaMagic, FaBook
} from 'react-icons/fa';

import '../assets/CSS/EmailOffcanvas.css'

const EmailOffcanvas = ({ show, handleClose, leadData }) => {
  // States for email form
  const [emailData, setEmailData] = useState({
    from: 'pipecrm@earthood.in',
    to: leadData?.email || 'afeefa@dkh.co.in',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email data:', emailData);
    // Here you would send the email via API
    // Then close the offcanvas
    handleClose();
  };

  // Remove recipient tag
  const removeRecipient = () => {
    setEmailData(prev => ({
      ...prev,
      to: ''
    }));
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose} 
      placement="end" 
      className="email-offcanvas"
    >
      <Offcanvas.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Button 
            variant="link"
            className="p-0 me-3 text-dark" 
            onClick={handleClose}
          >
            <FaTimes size={16} />
          </Button>
          <h5 className="mb-0">CA Afeefa K V</h5>
        </div>
        <div>
          <Button variant="link" className="text-muted">
            <FaTimes size={16} onClick={handleClose} />
          </Button>
        </div>
      </Offcanvas.Header>
      
      <Tab.Container defaultActiveKey="email">
        <Nav className="border-bottom">
          <Nav.Item>
            <Nav.Link eventKey="notes" className="px-4 py-3">
              <i className="bi bi-sticky me-2"></i>Notes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="activity" className="px-4 py-3">
              <i className="bi bi-calendar-event me-2"></i>Activity
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="email" className="px-4 py-3 active">
              <i className="bi bi-envelope me-2"></i>Email
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="notes">
            <div className="p-4">
              <Form.Control
                as="textarea"
                placeholder="Take a note, @name..."
                rows={3}
                className="border-0"
              />
            </div>
          </Tab.Pane>
          
          <Tab.Pane eventKey="activity">
            <div className="p-4">
              <p className="text-muted">Click here to add an activity...</p>
            </div>
          </Tab.Pane>
          
          <Tab.Pane eventKey="email" className="show active">
            <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
              <div className="email-form-fields p-3">
                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Label className="mb-0 me-2 text-muted" style={{ width: '60px' }}>From</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="from"
                      value={emailData.from}
                      onChange={handleChange}
                      className="form-select-sm"
                    >
                      <option value="pipecrm@earthood.in">pipecrm@earthood.in</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Label className="mb-0 me-2 text-muted" style={{ width: '60px' }}>To</Form.Label>
                  <InputGroup className="border rounded-1 p-1">
                    {emailData.to && (
                      <div className="d-flex align-items-center me-1">
                        <span className="recipient-tag">
                          CA Afeefa K V ({emailData.to})
                          <FaTimes size={10} className="ms-1 cursor-pointer" onClick={removeRecipient} />
                        </span>
                        <Form.Control
                          type="text"
                          className="border-0 flex-grow-1"
                          style={{ width: 'auto', minWidth: '50px' }}
                        />
                      </div>
                    )}
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Label className="mb-0 me-2 text-muted" style={{ width: '60px' }}>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    className="border-0"
                  />
                </Form.Group>
                
                <div className="email-template-options d-flex border-top border-bottom py-2">
                  <Button variant="light" size="sm" className="d-flex align-items-center me-2">
                    Choose template <FaChevronDown size={10} className="ms-1" />
                  </Button>
                  <Button variant="light" size="sm" className="d-flex align-items-center me-2">
                    Insert field <FaChevronDown size={10} className="ms-1" />
                  </Button>
                  <Button variant="light" size="sm" className="d-flex align-items-center me-auto">
                    Meeting scheduler <FaChevronDown size={10} className="ms-1" />
                  </Button>
                  <Button variant="light" size="sm" className="text-primary">
                    <FaMagic className="me-1" /> Write my email
                  </Button>
                </div>
              </div>
              
              <div className="email-body flex-grow-1 p-3">
                <Form.Control
                  as="textarea"
                  name="body"
                  value={emailData.body}
                  onChange={handleChange}
                  className="border-0 h-100"
                  style={{ resize: "none", minHeight: "200px" }}
                />
              </div>
              
              <div className="email-toolbar border-top p-2">
                <div className="d-flex mb-2">
                  <div className="d-flex flex-wrap">
                    <Button variant="light" className="p-1 me-1">
                      <FaArrowLeft />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaRedo />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaFont />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaFont />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <b>B</b>
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <i>I</i>
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <u>U</u>
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaList />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaListOl />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaQuoteRight />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaLink />
                    </Button>
                    <Button variant="light" className="p-1 me-1">
                      <FaImage />
                    </Button>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mt-2">
                  <div className="attachment-buttons d-flex me-auto">
                    <Button variant="light" className="p-1 me-2">
                      <FaPaperclip size={14} />
                    </Button>
                    <Button variant="light" className="p-1 me-2">
                      <FaBook />
                    </Button>
                    <Button variant="light" className="p-1">
                      <FaSmile size={14} />
                    </Button>
                  </div>
                  
                  <div className="d-flex">
                    <Button variant="light" size="sm" className="border me-2">
                      <FaLock />
                    </Button>
                    
                    <div className="d-flex">
                      <Button variant="success" type="submit" className="px-3">
                        Send
                      </Button>
                      <Button variant="success" className="dropdown-toggle dropdown-toggle-split">
                        <span className="visually-hidden">Toggle Dropdown</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      <div className="focus-section border-top p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Focus <FaAngleRight size={14} /></h6>
        </div>
        <div className="bg-light p-3 rounded">
          <div className="d-flex mb-2">
            <Button variant="light" size="sm" className="d-flex align-items-center me-2">
              <FaUsers size={14} className="me-1" /> <FaChevronDown size={10} className="ms-1" />
            </Button>
            <Form.Control
              type="text"
              placeholder="Meeting"
              className="me-2"
            />
          </div>
          <div className="d-flex">
            <Button variant="light" size="sm" className="me-2">In 1h</Button>
            <Button variant="light" size="sm" className="me-2">In 3h</Button>
            <Button variant="light" size="sm" className="me-2">Tomorrow</Button>
            <Button variant="light" size="sm" className="me-2">Next week</Button>
            <Button variant="outline-primary" size="sm">+ Other</Button>
          </div>
        </div>
      </div>
      
      <div className="history-section p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">History <FaAngleDown size={14} /></h6>
        </div>
        <div className="history-item d-flex mb-2">
          <div className="history-icon me-2">
            <FaUser size={14} className="bg-light p-1 rounded-circle" />
          </div>
          <div className="history-content">
            <p className="mb-0"><strong>Manually created → Lead created</strong></p>
            <p className="text-muted small mb-0">April 20, 2025 at 10:59 PM • Nayan Krishna</p>
          </div>
        </div>
      </div>
    </Offcanvas>
  );
};

export default EmailOffcanvas;