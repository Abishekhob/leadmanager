import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLayerGroup, FaUserCog, FaRandom, FaClock, FaFileUpload, FaFilter, FaTimes, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ImageTextSlider from '../components/ImageTextSlider';
import DemoLogins from '../components/DemoLogins';
import './style/HomePage.css';

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
            {!formType && (
              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button onClick={() => setFormType('login')} className="hero-btn primary-btn">
                  Login
                </button>
                <button onClick={() => setFormType('register')} className="hero-btn secondary-btn">
                  Register
                </button>
              </motion.div>
            )}
            {/* Demo Logins Section */}
            {!formType && <DemoLogins />}
          </div>
          <AnimatePresence>{formType && <FormCard formType={formType} setFormType={setFormType} />}</AnimatePresence>
        </div>
      </motion.div>

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