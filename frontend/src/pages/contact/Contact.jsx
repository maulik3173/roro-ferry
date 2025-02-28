import React from 'react';
import TopLayout from '../../layout/toppage/TopLayout';
import ContactForm from './ContactForm';

const Contact = () => {
  return (
    <div className="w-full space-y-12 pb-16">
      <TopLayout
        bgimg="https://videos.pexels.com/video-files/3994031/3994031-uhd_2560_1440_30fps.mp4"
        title="Contact us"
      />
      <ContactForm />
    </div>
  );
};

export default Contact;
