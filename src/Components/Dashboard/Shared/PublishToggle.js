// src/Components/Shared/PublishToggle.js

import React, { useState } from 'react';

const PublishToggle = ({ initialStatus, onToggle }) => {
  const [isPublished, setIsPublished] = useState(initialStatus);

  const handleToggle = () => {
    const newStatus = !isPublished;
    setIsPublished(newStatus);
    onToggle(newStatus); // Pass new status to parent component
  };

  return (
    <div>
      <button
        className={`btn ${isPublished ? 'btn-success' : 'btn-warning'}`}
        onClick={handleToggle}
      >
        {isPublished ? 'Published' : 'Unpublished'}
      </button>
    </div>
  );
};

export default PublishToggle;
