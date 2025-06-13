import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function HomePage() {
  const [formType, setFormType] = useState(null); // 'login' | 'register' | null

  const closeForm = () => setFormType(null);

  return (
    <div className="container-fluid p-0">
      {/* Hero Banner */}
      <div
        className="jumbotron bg-dark text-white d-flex align-items-center justify-content-center"
        style={{
          minHeight: '80vh',
          backgroundImage: 'url(/banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          className="overlay d-flex justify-content-center align-items-start p-5 rounded"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: '90%',
            maxWidth: '1200px',
          }}
        >
          {/* Left: Welcome section */}
          <div className="text-white me-5" style={{ flex: 1 }}>
            <h1 className="display-4">Welcome to LeadManager</h1>
            <p className="lead">Smart Lead & Task Management for Sales Teams</p>
            <div className="mt-4">
              <button
                className="btn btn-primary me-3"
                onClick={() => setFormType('login')}
              >
                Login
              </button>
              <button
                className="btn btn-outline-light"
                onClick={() => setFormType('register')}
              >
                Register
              </button>
            </div>
          </div>

          {/* Right: Form section */}
          {formType && (
            <div
              className="bg-white text-dark p-4 rounded position-relative"
              style={{ flex: 1, minWidth: '350px', maxWidth: '400px' }}
            >
              <button
                onClick={closeForm}
                className="btn-close position-absolute top-0 end-0 m-2"
                aria-label="Close"
              ></button>

              {formType === 'login' && (
                <LoginForm
                  embedded={true}
                  switchToRegister={() => setFormType('register')}
                />
              )}

              {formType === 'register' && (
                <RegisterForm
                  embedded={true}
                  switchToLogin={() => setFormType('login')}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Key Features</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <i className="fas fa-layer-group fa-3x text-secondary mb-3"></i>
            <h5>Stage-Based Workflow</h5>
            <p>Move leads from New → Contacted → Follow-up → Proposal Sent → Closed.</p>
          </div>

          <div className="col-md-4 mb-4">
            <i className="fas fa-user-cog fa-3x text-primary mb-3"></i>
            <h5>Role-Based Access</h5>
            <p>Admins, Proposal Creators, and Sales Users with task-specific privileges.</p>
          </div>

          

          <div className="col-md-4 mb-4">
            <i className="fas fa-random fa-3x text-success mb-3"></i>
            <h5>Random Lead Assignment</h5>
            <p>Distribute leads evenly among available salespeople in one click.</p>
          </div>

          <div className="col-md-4 mb-4">
            <i className="fas fa-clock fa-3x text-warning mb-3"></i>
            <h5>Follow-up Reminders</h5>
            <p>Receive timely notifications 2 hours before scheduled follow-ups.</p>
          </div>

          <div className="col-md-4 mb-4">
            <i className="fas fa-file-upload fa-3x text-info mb-3"></i>
            <h5>Proposal Requests</h5>
            <p>Sales users can request & track proposals; creators submit them for review.</p>
          </div>

          <div className="col-md-4 mb-4">
            <i className="fas fa-filter fa-3x text-danger mb-3"></i>
            <h5>Filterable Reports</h5>
            <p>View and download lead performance reports in Excel & PDF formats.</p>
          </div>

      
        </div>

        <div className="text-center mt-5">
          <h4>See It in Action</h4>
          <img
            src="/screenshot.png"
            alt="App Screenshot"
            className="img-fluid rounded shadow mt-3"
            style={{ maxWidth: '80%' }}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
