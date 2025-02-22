import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar component
import useBlogData from '../hooks/useBlogData'; // Import the custom hook

function BlogList() {
  const {
    blogs,
    categories,
    recentPosts,
    searchTerm,
    searchResults,
    handleSearch,
    formatDate
  } = useBlogData(); // Use the custom hook

  const navigate = useNavigate();

  const navigateToPost = (postId) => {
    navigate(`/singleblog/${postId}`);
  };

  return (
    <>
      {/* <!-- Hero Area Start--> */}
      <div className="slider-area ">
        <div className="single-slider section-overly slider-height2 d-flex align-items-center" data-background="assets/img/hero/about.jpg">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="hero-cap text-center">
                  <h2>Blog List</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Hero Area End --> */}
      {/* <!--================Blog Area =================--> */}
      <section className="blog_area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0">
              <div className="blog_left_sidebar">
                {blogs.map((blog, index) => (
                  <article className="blog_item" key={index}>
                    <div className="blog_item_img">
                      <img
                        className="card-img rounded-0"
                        src={blog.imageUrl || 'default-image.jpg'}
                        alt={blog.title}
                      />
                      <a href="#" className="blog_item_date">
                        {blog.createdAt && (
                          <>
                            <h3>{new Date(blog.createdAt.seconds * 1000).getDate()}</h3>
                            <p>{new Date(blog.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' })}</p>
                          </>
                        )}
                      </a>
                    </div>

                    <div className="blog_details">
                      <a className="d-inline-block" href={`singleblog/${blog.id}`}>
                        <h2>{blog.title}</h2>
                      </a>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: blog.content ? blog.content.substring(0, 200) + '...' : ''
                        }}
                      />

                      <ul className="blog-info-link">
                        <li><a href="#"><i className="fa fa-user"></i> {blog.authorName || "Unknown"}</a></li>
                        <li><a href="#"><i className="fa fa-hashtag"></i> {blog.category}</a></li>
                        <li><a href="#"><i className="fa fa-comments"></i> {blog.tags ? blog.tags.length : 0} Comments</a></li>
                      </ul>
                    </div>
                  </article>
                ))}

                <nav className="blog-pagination justify-content-center d-flex">
                  <ul className="pagination">
                    <li className="page-item">
                      <a href="#" className="page-link" aria-label="Previous">
                        <i className="ti-angle-left"></i>
                      </a>
                    </li>
                    <li className="page-item">
                      <a href="#" className="page-link">1</a>
                    </li>
                    <li className="page-item active">
                      <a href="#" className="page-link">2</a>
                    </li>
                    <li className="page-item">
                      <a href="#" className="page-link" aria-label="Next">
                        <i className="ti-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-lg-4">
              <Sidebar 
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                searchResults={searchResults}
                categories={categories}
                recentPosts={recentPosts}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>
      </section>
      {/* <!--================ Blog Area end =================--> */}
    </>
  );
}

export default BlogList;