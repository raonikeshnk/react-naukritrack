import React from 'react';

const JobDetailsModal = ({ job, onClose }) => {
  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{job.title}</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Posted Date:</strong> {job.postedDate ? new Date(job.postedDate.seconds * 1000).toLocaleDateString() : "N/A"}</p>
            <p><strong>End Date:</strong> {job.endDate ? new Date(job.endDate.seconds * 1000).toLocaleDateString() : "N/A"}</p>
            <p><strong>Job Type:</strong> {job.jobType ? job.jobType.join(", ") : "N/A"}</p>
            <p><strong>Experience:</strong> {job.experience ? job.experience.join(", ") : "N/A"}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;