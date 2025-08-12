import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLayerGroup, FaUserCog, FaRandom, FaClock, FaFileUpload, FaFilter, FaTimes, FaLinkedin, FaGithub, FaEnvelope, FaUserShield, FaUser, FaCopy } from 'react-icons/fa';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ImageTextSlider from '../components/ImageTextSlider';
import './style/HomePage.css';

// Component for the Demo Logins - Placed outside the main component for clarity
const DemoLogins = () => {
  const [copied, setCopied] = useState(null); // 'admin-email' or 'user-password'

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const demoAccounts = [
    { type: 'admin', email: 'admin@lm.com', password: 'demo123', icon: <FaUserShield />, label: 'Admin' },
    { type: 'user', email: 'user@lm.com', password: 'demo123', icon: <FaUser />, label: 'Sales User' },
  ];

  return (
    <motion.div
      className="demo-logins-container"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h4 className="demo-title">Or try a demo account:</h4>
      <div className="demo-cards-wrapper">
        {demoAccounts.map((account, index) => (
          <div key={index} className="demo-card">
            <div className="demo-card-header">
              <div className="demo-icon-wrapper">{account.icon}</div>
              <span className="demo-label">{account.label}</span>
            </div>
            <div className="demo-credentials">
              <div className="credential-item">
                <span className="credential-label">Email:</span>
                <div className="credential-value-wrapper">
                  <span className="credential-value">{account.email}</span>
                  <button onClick={() => copyToClipboard(account.email, `${account.type}-email`)} aria-label={`Copy ${account.label} email`}>
                    <FaCopy />
                    <AnimatePresence>
                      {copied === `${account.type}-email` && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="copied-tooltip"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
              <div className="credential-item">
                <span className="credential-label">Password:</span>
                <div className="credential-value-wrapper">
                  <span className="credential-value">{account.password}</span>
                  <button onClick={() => copyToClipboard(account.password, `${account.type}-password`)} aria-label={`Copy ${account.label} password`}>
                    <FaCopy />
                    <AnimatePresence>
                      {copied === `${account.type}-password` && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="copied-tooltip"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Features data, variants, and FormCard remain the same
const features = [
  { icon: <FaLayerGroup />, title: 'Stage-Based Workflow', description: 'Move leads from New → Contacted → Follow-up → Proposal Sent → Closed.' },
  { icon: <FaUserCog />, title: 'Role-Based Access', description: 'Admins, Proposal Creators, and Sales Users with task-specific privileges.' },
  { icon: <FaRandom />, title: 'Random Lead Assignment', description: 'Distribute leads evenly among available salespeople in one click.' },
  { icon: <FaClock />, title: 'Follow-up Reminders', description: 'Receive timely notifications 2 hours before scheduled follow-ups.' },
  { icon: <FaFileUpload />, title: 'Proposal Requests', description: 'Sales users can request & track proposals; creators submit them for review.' },
  { icon: <FaFilter />, title: 'Filterable Reports', description: 'View and download lead performance reports in Excel & PDF formats.' },
];

const staggerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const FormCard = ({ formType, setFormType }) => {
  return (
    <motion.div
      key="form-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="form-card"
    >
      <button onClick={() => setFormType(null)} className="form-close-btn" aria-label="Close form">
        <FaTimes />
      </button>
      <AnimatePresence mode="wait">
        {formType === 'login' && (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LoginForm embedded={true} switchToRegister={() => setFormType('register')} />
          </motion.div>
        )}
        {formType === 'register' && (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RegisterForm embedded={true} switchToLogin={() => setFormType('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
  
export default function HomePage() {
  const [formType, setFormType] = useState(null);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-title">
              Welcome to <br />
              <span>LeadManager</span>
            </h1>
            <p className="hero-subtitle">Smart Lead & Task Management for Sales Teams</p>
            <div className="hero-buttons">
              <button onClick={() => setFormType('login')} className="hero-btn primary-btn">
                Login
              </button>
              <button onClick={() => setFormType('register')} className="hero-btn secondary-btn">
                Register
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {formType && (
            <motion.div
              className="form-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FormCard formType={formType} setFormType={setFormType} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Demo Logins Section - New, dedicated section */}
      <motion.section
        className="demo-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <DemoLogins />
      </motion.section>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Key Features</h2>
        <motion.div
          className="features-grid"
          variants={staggerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div className="feature-card" key={index} variants={itemVariants}>
              <div className="feature-icon">{feature.icon}</div>
              <h5 className="feature-title">{feature.title}</h5>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Slider Section */}
      <div className="slider-section">
        <ImageTextSlider />
      </div>

      {/* Footer Section */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} LeadManager. All rights reserved.</p>
          <div className="footer-social-links">
            <a href="mailto:abishekhjuve@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <FaEnvelope />
            </a>
            <a href="https://www.linkedin.com/in/abishekhob/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/Abishekhob/leadmanager" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}