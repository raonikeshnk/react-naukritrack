import React, { useEffect, useState } from 'react';
import { db } from './Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import JobDetailsModal from './JobDetailsModal';

function JobListing() {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    jobType: [],
    jobLocation: '',
    experience: [],
    postedWithin: []
  });

  useEffect(() => {
    const fetchJobPosts = async () => {
      const jobPostsCollection = collection(db, 'jobPosts');
      const jobPostsSnapshot = await getDocs(jobPostsCollection);
      const jobPostsList = jobPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobPosts(jobPostsList);
    };

    fetchJobPosts();
  }, []);

  useEffect(() => {
    // Initialize Nice Select
    const $ = window.$; // Ensure jQuery is available
    $('select').niceSelect(); // Initialize Nice Select on the original select element
  }, []);

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'jobType' || name === 'experience' || name === 'postedWithin') {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: checked
          ? [...prevFilters[name], value]
          : prevFilters[name].filter(item => item !== value)
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }));
    }
  };

  const filteredJobPosts = jobPosts.filter(job => {
    const matchesType = filters.jobType.length ? filters.jobType.some(type => job.jobType.includes(type)) : true;
    const matchesLocation = filters.jobLocation ? job.location === filters.jobLocation : true;
    const matchesExperience = filters.experience.length ? filters.experience.some(exp => job.experience.includes(exp)) : true;
    const matchesPostedWithin = filters.postedWithin.length ? filters.postedWithin.includes(job.postedWithin) : true;

    return matchesType && matchesLocation && matchesExperience && matchesPostedWithin;
  });

  const uniqueLocations = [...new Set(jobPosts.map(job => job.location))];

  return (
    <>
      <main>
        <div className="slider-area ">
          <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{ backgroundImage: `url(assets/img/hero/about.jpg)` }}>
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="hero-cap text-center">
                    <h2>Get your job</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="job-listing-area pt-120 pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-4">
                <div className="row">
                  <div className="col-12">
                    <div className="small-section-tittle2 mb-45">
                      <div className="ion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="12px">
                          <path fillRule="evenodd" fill="rgb(27, 207, 107)" d="M7.778,12.000 L12.222,12.000 L12.222,10.000 L7.778,10.000 L7.778,12.000 ZM-0.000,-0.000 L-0.000,2.000 L20.000,2.000 L20.000,-0.000 L-0.000,-0.000 ZM3.333,7.000 L16.667,7.000 L16.667,5.000 L3.333,5.000 L3.333,7.000 Z" />
                        </svg>
                      </div>
                      <h4>Filter Jobs</h4>
                    </div>
                  </div>
                </div>
                <div className="job-category-listing mb-50">
                  <div className="single-listing">
                    <div className="small-section-tittle2">
                      <h4>Job Type</h4>
                    </div>
                    <label className="container">Full Time
                      <input type="checkbox" name="jobType" value="Full Time" onChange={handleFilterChange} />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">Part Time
                      <input type="checkbox" name="jobType" value="Part Time" onChange={handleFilterChange} />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">Remote
                      <input type="checkbox" name="jobType" value="Remote" onChange={handleFilterChange} />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">Freelance
                      <input type="checkbox" name="jobType" value="Freelance" onChange={handleFilterChange} />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="single-listing">
                    <div className="small-section-tittle2">
                      <h4>Job Location</h4>
                    </div>
                    <div className="select-job-items2">
                      <select name="jobLocation" onChange={handleFilterChange}>
                        <option value="">Anywhere</option>
                        {uniqueLocations.map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    <div className="select-Categories pt-80 pb-50">
                      <div className="small-section-tittle2">
                        <h4>Experience</h4>
                      </div>
                      <label className="container">1-2 Years
                        <input type="checkbox" name="experience" value="1-2 Years" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">2-3 Years
                        <input type="checkbox" name="experience" value="2-3 Years" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">3-6 Years
                        <input type="checkbox" name="experience" value="3-6 Years" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">6-more..
                        <input type="checkbox" name="experience" value="6-more" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="single-listing">
                    <div className="select-Categories pb-50">
                      <div className="small-section-tittle2">
                        <h4>Posted Within</h4>
                      </div>
                      <label className="container">Any
                        <input type="checkbox" name="postedWithin" value="Any" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">Today
                        <input type="checkbox" name="postedWithin" value="Today" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">Last 2 days
                        <input type="checkbox" name="postedWithin" value="Last 2 days" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">Last 3 days
                        <input type="checkbox" name="postedWithin" value="Last 3 days" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">Last 5 days
                        <input type="checkbox" name="postedWithin" value="Last 5 days" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">Last 10 days
                        <input type="checkbox" name="postedWithin" value="Last 10 days" onChange={handleFilterChange} />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="single-listing">
                    <aside className="left_widgets p_filter_widgets price_rangs_aside sidebar_box_shadow">
                      <div className="small-section-tittle2">
                        <h4>Filter Jobs</h4>
                      </div>
                      <div className="widgets_inner">
                        <div className="range_item">
                          <input type="text" className="js-range-slider" value="" />
                          <div className="d-flex align-items-center">
                            <div className="price_text">
                              <p>Price :</p>
                            </div>
                            <div className="price_value d-flex justify-content-center">
                              <input type="text" className="js-input-from" id="amount" readOnly />
                              <span>to</span>
                              <input type="text" className="js-input-to" id="amount" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9 col-md-8">
                <section className="featured-job-area">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="count-job mb-35">
                          <span>{filteredJobPosts.length} Jobs found</span>
                          <div className="select-job-items">
                            <span>Sort by</span>
                            <select name="select">
                              <option value="">None</option>
                              <option value="">job list</option>
                              <option value="">job list</option>
                              <option value="">job list</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {filteredJobPosts.map((job) => (
                      <div className="single-job-items mb-30" key={job.id}>
                        <div className="job-items">
                          <div className="company-img">
                            <button href="#"><img src={job.companyLogo || './assets/img/icon/company.png'} alt={`${job.company} logo`} style={{ width: '50px', height: '50px' }} /></button>
                          </div>
                          <div className="job-tittle job-tittle2">
                            <button href="#" onClick={() => handleViewDetails(job)}>
                              <h4>{job.title}</h4>
                            </button>
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
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className="pagination-area pb-115 text-center">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="single-wrap d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-start">
                      <li className="page-item active"><button className="page-link" href="#">01</button></li>
                      <li className="page-item"><button className="page-link" href="#">02</button></li>
                      <li className="page-item"><button className="page-link" href="#">03</button></li>
                      <li className="page-item"><button className="page-link" href="#"><span className="ti-angle-right"></span></button></li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {selectedJob && <JobDetailsModal job={selectedJob} onClose={handleCloseDetails} />}
    </>
  );
}

export default JobListing;