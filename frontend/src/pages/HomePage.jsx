// pages/HomePage.jsx
import { Link } from 'react-router-dom';
 // You can create this CSS for additional styles

function HomePage() {
  return (
    <div className="container-fluid p-0">
      {/* Hero Banner */}
      <div className="jumbotron text-center bg-dark text-white d-flex align-items-center justify-content-center" style={{ height: '80vh', backgroundImage: 'url(/banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="overlay text-white p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <h1 className="display-4">Welcome to LeadManager</h1>
          <p className="lead">Your smart lead management and tracking system</p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-primary me-3">Login</Link>
            <Link to="/register" className="btn btn-outline-light">Register</Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <i className="fas fa-tasks fa-3x text-primary mb-3"></i>
            <h5>Lead Tracking</h5>
            <p>Track leads from capture to conversion.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
            <h5>Performance Reports</h5>
            <p>Visualize user and team performance.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-bell fa-3x text-warning mb-3"></i>
            <h5>Notifications</h5>
            <p>Get alerts on new tasks, deadlines & approvals.</p>
          </div>
        </div>

        {/* Screenshot section (optional) */}
        <div className="text-center mt-5">
          <h4>See It in Action</h4>
          <img src="/screenshot.png" alt="App Screenshot" className="img-fluid rounded shadow mt-3" style={{ maxWidth: '80%' }} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
