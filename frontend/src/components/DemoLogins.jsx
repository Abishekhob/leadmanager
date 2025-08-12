import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaUser, FaCopy } from 'react-icons/fa';
import './styles/DemoLogins.css';

const DemoLogins = () => {
  const [copied, setCopied] = useState(null); // 'admin' or 'user'

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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h4 className="demo-title">Or try a demo account</h4>
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

export default DemoLogins;