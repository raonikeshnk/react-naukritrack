import React, { useState, useEffect } from 'react';
import { db, storage } from '../../Firebase/firebase'; // Make sure to configure Firebase and Firebase storage
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const JobPostForm = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [postedDate, setPostedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [jobType, setJobType] = useState([]);
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setPostedDate(currentDate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let companyLogoURL = '';
      if (companyLogo) {
        const logoRef = ref(storage, `companyLogos/${companyLogo.name}`);
        const snapshot = await uploadBytes(logoRef, companyLogo);
        companyLogoURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'jobPosts'), {
        title,
        company,
        location,
        description,
        requirements,
        salary,
        currency,
        postedDate: new Date(postedDate),
        endDate: new Date(endDate),
        isPublished: false,
        jobType,
        category,
        experience,
        companyLogo: companyLogoURL || 'default-logo.png'
      });
      toast.success('Job post added successfully!');
      setTitle('');
      setCompany('');
      setLocation('');
      setDescription('');
      setRequirements('');
      setSalary('');
      setCurrency('USD');
      setPostedDate('');
      setEndDate('');
      setJobType([]);
      setCategory('');
      setExperience([]);
      setCompanyLogo(null);
    } catch (error) {
      toast.error('Error adding job post: ' + error.message);
    }
  };

  const handleCheckboxChange = (e, stateSetter) => {
    const { value, checked } = e.target;
    stateSetter(prevState => checked ? [...prevState, value] : prevState.filter(item => item !== value));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Company</label>
        <input type="text" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Company Logo</label>
        <input type="file" className="form-control" onChange={(e) => setCompanyLogo(e.target.files[0])} />
      </div>
      <div className="mb-3">
        <label className="form-label">Location</label>
        <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label">Requirements</label>
        <textarea className="form-control" value={requirements} onChange={(e) => setRequirements(e.target.value)} required></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label">Salary</label>
        <div className="input-group">
          <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)} required>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            {/* <!-- Add more currencies as needed --> */}
          </select>
          <input type="number" className="form-control" value={salary} onChange={(e) => setSalary(e.target.value)} required />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Posted Date</label>
        <input type="date" className="form-control" value={postedDate} onChange={(e) => setPostedDate(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">End Date</label>
        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Category 1">Category 1</option>
          <option value="Category 2">Category 2</option>
          <option value="Category 3">Category 3</option>
          <option value="Category 4">Category 4</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Job Type</label>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Full Time" onChange={(e) => handleCheckboxChange(e, setJobType)} />
          <label className="form-check-label">Full Time</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Part Time" onChange={(e) => handleCheckboxChange(e, setJobType)} />
          <label className="form-check-label">Part Time</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Remote" onChange={(e) => handleCheckboxChange(e, setJobType)} />
          <label className="form-check-label">Remote</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="Freelance" onChange={(e) => handleCheckboxChange(e, setJobType)} />
          <label className="form-check-label">Freelance</label>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Experience</label>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="1-2 Years" onChange={(e) => handleCheckboxChange(e, setExperience)} />
          <label className="form-check-label">1-2 Years</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="2-3 Years" onChange={(e) => handleCheckboxChange(e, setExperience)} />
          <label className="form-check-label">2-3 Years</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="3-6 Years" onChange={(e) => handleCheckboxChange(e, setExperience)} />
          <label className="form-check-label">3-6 Years</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="6-more" onChange={(e) => handleCheckboxChange(e, setExperience)} />
          <label className="form-check-label">6-more</label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Add Job Post</button>
    </form>
  );
};

export default JobPostForm;