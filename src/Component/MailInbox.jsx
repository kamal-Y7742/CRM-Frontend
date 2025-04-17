// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Form, ListGroup, Badge } from 'react-bootstrap';
// import { 
//   Inbox, 
//   Star, 
//   Clock, 
//   Send, 
//   FileText, 
//   Trash, 
//   Tag, 
//   ChevronDown, 
//   Paperclip, 
//   RotateCw, 
//   MoreVertical, 
//   Search 
// } from 'lucide-react';

// const MailInbox = () => {
//   const [emails, setEmails] = useState([
//     {
//       id: 1,
//       sender: 'GitHub',
//       subject: 'New pull request submitted',
//       preview: 'John Doe has submitted a new pull request to your repository.',
//       time: '10:45 AM',
//       read: false,
//       starred: true,
//       attachment: true
//     },
//     {
//       id: 2,
//       sender: 'Slack',
//       subject: 'New message from Marketing team',
//       preview: 'Sarah: Can everyone review the latest campaign draft by EOD?',
//       time: '9:32 AM',
//       read: false,
//       starred: false,
//       attachment: false
//     },
//     {
//       id: 3,
//       sender: 'Netflix',
//       subject: 'New shows added to your watchlist',
//       preview: 'Check out the latest additions to Netflix this week!',
//       time: 'Yesterday',
//       read: true,
//       starred: false,
//       attachment: false
//     },
//     {
//       id: 4,
//       sender: 'LinkedIn',
//       subject: 'You have 5 new connections',
//       preview: 'Connect with professionals in your industry and expand your network.',
//       time: 'Yesterday',
//       read: true,
//       starred: false,
//       attachment: false
//     },
//     {
//       id: 5,
//       sender: 'AWS',
//       subject: 'Your monthly usage report',
//       preview: 'Your AWS usage report for the previous month is now available.',
//       time: 'Apr 3',
//       read: true,
//       starred: true,
//       attachment: true
//     }
//   ]);

//   const [selectedEmails, setSelectedEmails] = useState([]);
//   const [selectedMailCategory, setSelectedMailCategory] = useState('inbox');

//   const toggleEmailSelection = (id) => {
//     if (selectedEmails.includes(id)) {
//       setSelectedEmails(selectedEmails.filter(emailId => emailId !== id));
//     } else {
//       setSelectedEmails([...selectedEmails, id]);
//     }
//   };

//   const markAsRead = (id) => {
//     setEmails(emails.map(email => 
//       email.id === id ? { ...email, read: true } : email
//     ));
//   };

//   const toggleStar = (id, e) => {
//     e.stopPropagation();
//     setEmails(emails.map(email => 
//       email.id === id ? { ...email, starred: !email.starred } : email
//     ));
//   };

//   return (
//     <Container fluid className="p-0">
//       <Row className="h-100">
//         {/* Mail categories sidebar */}
//         <Col md={2} className="bg-white p-0 border-end">
//           <div className="p-3">
//             <Button variant="primary" className="rounded-pill w-100 mb-4">
//               <span className="me-2">+ Compose</span>
//             </Button>
            
//             <ListGroup variant="flush">
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'inbox'}
//                 onClick={() => setSelectedMailCategory('inbox')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <Inbox size={18} className="me-3" />
//                 <span>Inbox</span>
//                 <Badge bg="danger" className="ms-auto">2</Badge>
//               </ListGroup.Item>
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'starred'}
//                 onClick={() => setSelectedMailCategory('starred')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <Star size={18} className="me-3" />
//                 <span>Starred</span>
//               </ListGroup.Item>
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'snoozed'}
//                 onClick={() => setSelectedMailCategory('snoozed')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <Clock size={18} className="me-3" />
//                 <span>Snoozed</span>
//               </ListGroup.Item>
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'sent'}
//                 onClick={() => setSelectedMailCategory('sent')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <Send size={18} className="me-3" />
//                 <span>Sent</span>
//               </ListGroup.Item>
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'drafts'}
//                 onClick={() => setSelectedMailCategory('drafts')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <FileText size={18} className="me-3" />
//                 <span>Drafts</span>
//               </ListGroup.Item>
//               <ListGroup.Item 
//                 action 
//                 active={selectedMailCategory === 'trash'}
//                 onClick={() => setSelectedMailCategory('trash')}
//                 className="d-flex align-items-center py-2"
//               >
//                 <Trash size={18} className="me-3" />
//                 <span>Trash</span>
//               </ListGroup.Item>
//             </ListGroup>
            
//             <div className="mt-3 px-2">
//               <div className="d-flex align-items-center">
//                 <strong className="me-auto">Labels</strong>
//                 <ChevronDown size={16} />
//               </div>
//               <ListGroup variant="flush" className="mt-1">
//                 <ListGroup.Item 
//                   action 
//                   className="d-flex align-items-center py-1 ps-2 border-0"
//                 >
//                   <Tag size={16} className="me-3" color="#de5246" />
//                   <span>Important</span>
//                 </ListGroup.Item>
//                 <ListGroup.Item 
//                   action 
//                   className="d-flex align-items-center py-1 ps-2 border-0"
//                 >
//                   <Tag size={16} className="me-3" color="#4285f4" />
//                   <span>Work</span>
//                 </ListGroup.Item>
//                 <ListGroup.Item 
//                   action 
//                   className="d-flex align-items-center py-1 ps-2 border-0"
//                 >
//                   <Tag size={16} className="me-3" color="#0f9d58" />
//                   <span>Personal</span>
//                 </ListGroup.Item>
//               </ListGroup>
//             </div>
//           </div>
//         </Col>
        
//         {/* Email List */}
//         <Col md={10} className="p-0 bg-light">
//           <div className="bg-white border-bottom p-2 d-flex align-items-center">
//             <Form.Check 
//               type="checkbox" 
//               className="me-2"
//               onChange={() => {
//                 if (selectedEmails.length === emails.length) {
//                   setSelectedEmails([]);
//                 } else {
//                   setSelectedEmails(emails.map(email => email.id));
//                 }
//               }}
//               checked={selectedEmails.length === emails.length && emails.length > 0}
//             />
//             <Button variant="light" size="sm" className="me-1" title="Refresh">
//               <RotateCw size={16} />
//             </Button>
//             <Button variant="light" size="sm" className="me-1" title="More">
//               <MoreVertical size={16} />
//             </Button>
            
//             <div className="ms-auto">
//               <Form.Group className="d-flex align-items-center">
//                 <div className="position-relative">
//                   <Form.Control
//                     type="text"
//                     placeholder="Search mail"
//                     className="rounded-pill ps-4"
//                   />
//                   <Search size={16} className="position-absolute" style={{ left: '10px', top: '8px' }} />
//                 </div>
//               </Form.Group>
//             </div>
//           </div>
          
//           <ListGroup variant="flush" className="email-list">
//             {emails.map(email => (
//               <ListGroup.Item 
//                 key={email.id}
//                 action
//                 className={`d-flex py-2 px-3 ${!email.read ? 'fw-bold bg-white' : 'bg-light'}`}
//                 onClick={() => {
//                   markAsRead(email.id);
//                 }}
//               >
//                 <div className="d-flex align-items-center me-3">
//                   <Form.Check 
//                     type="checkbox" 
//                     className="me-2"
//                     checked={selectedEmails.includes(email.id)}
//                     onChange={() => toggleEmailSelection(email.id)}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <Star 
//                     size={18} 
//                     fill={email.starred ? "#f5bd00" : "none"} 
//                     stroke={email.starred ? "#f5bd00" : "currentColor"}
//                     onClick={(e) => toggleStar(email.id, e)} 
//                     style={{ cursor: 'pointer' }}
//                   />
//                 </div>
//                 <div className="flex-grow-1 d-flex">
//                   <div className="sender-col" style={{ width: '180px' }}>
//                     {email.sender}
//                   </div>
//                   <div className="flex-grow-1 text-truncate">
//                     <span className="subject-text">{email.subject}</span>
//                     <span className="text-secondary"> - </span>
//                     <span className="preview-text text-secondary text-truncate">{email.preview}</span>
//                   </div>
//                   <div className="ms-auto d-flex align-items-center">
//                     {email.attachment && <Paperclip size={16} className="me-2" />}
//                     <span className="text-secondary time-col">{email.time}</span>
//                   </div>
//                 </div>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default MailInbox;
import React from 'react'

const MailInbox = () => {
  return (
    <div>MailInbox</div>
  )
}

export default MailInbox