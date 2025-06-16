import React, { useState, useEffect } from 'react';
import './styles/ImageTextSlider.css';

const sliderData = [
  {
    image: '/images/admin-dashboard.png',
    text: 'View all leads grouped by status. Easily track follow-ups, proposals, and progress at a glance.',
  },
  {
    image: '/images/user-dashboard.png',
    text: 'Users see only the leads assigned to them, neatly categorized by their current status.',
  },
  {
    image: '/images/manage-users.png',
    text: 'Admins can disable/delete users, promote them to proposal creators or admins, invite new users via email, and change user passwords.',
  },
  {
    image: '/images/reports.png',
    text: 'Admins can generate detailed reports, filter by category, status, or user, and export them in Excel or PDF.',
  },
  {
    image: '/images/notifications.png',
    text: 'Real-time notifications for users when leads are assigned; admins get alerts for follow-ups with date and time.',
  },
  {
    image: '/images/lead-details.png',
    text: 'Clicking a lead opens its full details, including past activity, status updates, and follow-up logs.',
  },
  {
    image: '/images/proposals.png',
    text: 'Users assign proposal requests to creators. Proposal creators can submit, and users can mark them as completed.',
  },
  {
    image: '/images/profile-page.png',
    text: 'The profile page shows the user’s name, email, and phone. Users can add a bio and change their profile picture.',
  },
];

const ImageTextSlider = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade-out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % sliderData.length);
        setFade(true); // fade-in
      }, 300); // match fade-out time
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (i) => {
    setFade(false);
    setTimeout(() => {
      setIndex(i);
      setFade(true);
    }, 300);
  };

  return (
    <div className="container mt-5">
      <h4 className="text-center mb-4">See It in Action</h4>
      <div className={`row align-items-center slider-fade ${fade ? 'fade-in' : 'fade-out'}`}>
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={sliderData[index].image}
            alt={`Screenshot ${index + 1}`}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px' }}
          />
        </div>
        <div className="col-md-6">
          <p style={{ fontSize: '1.1rem' }}>{sliderData[index].text}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="text-center mt-3">
        {sliderData.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageTextSlider;
