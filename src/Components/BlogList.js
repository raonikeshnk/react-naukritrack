import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar component
import useBlogData from '../hooks/useBlogData'; // Import the custom hook

function BlogList() {
  const location = useLocation();
  const { state } = location;
  console.log("BlogList - location state:", state);

  const {
    blogs,
    categories,
    recentPosts,
    searchTerm,
    searchResults,
    handleSearch,
    formatDate,
    handleCategoryClick,
    filteredBlogs,
    currentPage,
    setCurrentPage,
    blogsPerPage,
    blogsLoaded
  } = useBlogData(); // Use the custom hook

  useEffect(() => {
    if (blogsLoaded) {
      console.log("BlogList - useEffect - state:", state);
      if (state && state.category) {
        console.log("BlogList - Applying category filter:", state.category);
        handleCategoryClick(state.category);
      } else {
        console.log("BlogList - No category filter, setting current page to 1");
        setCurrentPage(1);
      }
    }
  }, [state, blogsLoaded]);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  console.log("BlogList - currentBlogs:", currentBlogs);

  const paginate = (pageNumber) => {
    console.log("Paginating to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* <!-- Hero Area Start--> */}
      <div className="slider-area">
        <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{ backgroundImage: `url(/assets/img/hero/about.jpg)` }}>
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
                {currentBlogs.map((blog, index) => (
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
                      <Link className="d-inline-block" to={`/singleblog/${blog.id}`}>
                        <h2>{blog.title}</h2>
                      </Link>
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
                    {[...Array(Math.ceil(filteredBlogs.length / blogsPerPage)).keys()].map(number => (
                      <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                        <a onClick={() => paginate(number + 1)} href="#" className="page-link">
                          {number + 1}
                        </a>
                      </li>
                    ))}
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
                handleCategoryClick={(category) => {
                  handleCategoryClick(category);
                  setCurrentPage(1);
                }}
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