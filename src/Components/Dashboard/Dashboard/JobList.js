import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase'; // Firebase configuration
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import JobDetailsModal from '../../JobDetailsModal';

const JobList = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      const jobPostsCollection = collection(db, 'jobPosts');
      const jobPostsSnapshot = await getDocs(jobPostsCollection);
      const jobPostsList = jobPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobPosts(jobPostsList);
    };

    fetchJobPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'jobPosts', id));
      setJobPosts(jobPosts.filter(job => job.id !== id));
      toast.success('Job post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete job post. Please try again.');
    }
  };

  const handleTogglePublish = async (job) => {
    const updatedJob = { ...job, isPublished: !job.isPublished };
    try {
      await updateDoc(doc(db, 'jobPosts', job.id), updatedJob);
      setJobPosts(jobPosts.map(j => (j.id === job.id ? updatedJob : j)));
      toast.success(`Job post ${job.isPublished ? 'unpublished' : 'published'} successfully!`);
    } catch (error) {
      toast.error('Failed to update job post. Please try again.');
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="p-4 border rounded">
      <h2>Manage Job Posts</h2>
      {jobPosts.map((job) => (
        <div className="single-job-items mb-30" key={job.id}>
          <div className="job-items">
            <div className="company-img">
              <a href="#"><img src={job.companyLogo || 'assets/img/icon/job-list1.png'} alt={`${job.company} logo`} style={{ width: '50px', height: '50px' }} /></a>
            </div>
            <div className="job-tittle job-tittle2">
              <a href="#" onClick={() => handleViewDetails(job)}>
                <h4>{job.title}</h4>
              </a>
              <ul>
                <li>{job.company}</li>
                <li><i className="fas fa-map-marker-alt"></i>{job.location}</li>
                <li>{job.currency} {job.salary}</li>
              </ul>
            </div>
          </div>
          <div className="items-link items-link2 f-right">
            <a href="job_details.html">{job.jobType ? job.jobType.join(", ") : "N/A"}</a>
            <span>{job.postedDate ? new Date(job.postedDate.seconds * 1000).toLocaleDateString() : "N/A"}</span>
          </div>
          <button onClick={() => handleTogglePublish(job)} className="btn btn-secondary me-2">
            {job.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={() => handleDelete(job.id)} className="btn btn-danger">Delete</button>
        </div>
      ))}
      {selectedJob && <JobDetailsModal job={selectedJob} onClose={handleCloseDetails} />}
    </div>
  );
};

export default JobList;