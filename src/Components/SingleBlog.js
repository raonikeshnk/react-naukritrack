import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../partials/Sidebar'; // Import the Sidebar component
import useBlogData from '../hooks/useBlogData'; // Import the custom hook

function SingleBlog() {
  const { id: blogId } = useParams(); // Get blog ID from URL params
  const {
    blog,
    categories,
    recentPosts,
    searchTerm,
    searchResults,
    allBlogs,
    author,
    prevPost,
    nextPost,
    instagramFeed,
    loading,
    handleSearch,
    formatDate
  } = useBlogData(blogId); // Use the custom hook

  const navigate = useNavigate();

  const navigateToPost = (postId) => {
    navigate(`/singleblog/${postId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found!</p>;

  return (
    <>
      {/* <!-- Hero Area Start--> */}
      <div className="slider-area ">
        <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{ backgroundImage: `url(/assets/img/hero/about.jpg)` }}>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="hero-cap text-center">
                  <h2>Blog Details</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Hero Area End --> */}
      {/* <!--================Blog Area =================--> */}
      <section className="blog_area single-post-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 posts-list">
              <div className="single-post">
                <div className="feature-img">
                  <img className="img-fluid" src={blog.imageUrl || "/assets/img/blog/single_blog_1.png"} style={{ height: '400px' }} alt={blog.title} />
                </div>
                <div className="blog_details">
                  <h2>{blog.title}</h2>
                  <ul className="blog-info-link mt-3 mb-4">
                    <li>
                      <a href="#"><i className="fa fa-user"></i> {blog.category || "Uncategorized"}</a>
                    </li>
                    <li>
                      <a href="#"><i className="fa fa-comments"></i> {blog.comments?.length || 0} Comments</a>
                    </li>
                  </ul>
                  <p dangerouslySetInnerHTML={{ __html: blog.content ? blog.content : 'no content' }} />
                </div>
              </div>

              <div className="navigation-top">
                <div className="d-sm-flex justify-content-between text-center">
                  <p className="like-info"><span className="align-middle"><i className="fa fa-heart"></i></span> Lily and 4 people like this</p>
                  <div className="col-sm-4 text-center my-2 my-sm-0">
                    <p className="comment-count"><span className="align-middle"><i className="fa fa-comment"></i></span> 06 Comments</p>
                  </div>
                  <div className="social-icons">
                    <li>{author?.socialLinks?.facebook && <a href={`https://facebook.com/${author.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>}</li>
                    <li>{author?.socialLinks?.twitter && <a href={`https://twitter.com/${author.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer"> <i className="fab fa-twitter"></i></a>}</li>
                    <li>{author?.socialLinks?.linkedin && <a href={`https://linkedin.com/in/${author.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i> </a>}</li>
                    <li>{author?.socialLinks?.instagram && <a href={`https://instagram.com/${author.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>}</li>
                  </div>
                </div>
                <div className="navigation-area">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 nav-left flex-row d-flex justify-content-start align-items-center">
                      {prevPost && (
                        <>
                          <div className="thumb">
                            <a onClick={() => navigateToPost(prevPost.id)}><img className="img-fluid" src={prevPost.imageUrl || "/assets/img/post/preview.png"} style={{ width: '60px' }} alt="" /></a>
                          </div>
                          <div className="arrow">
                            <a onClick={() => navigateToPost(prevPost.id)}><span className="lnr text-white ti-arrow-left"></span></a>
                          </div>
                          <div className="detials">
                            <p>Prev Post</p>
                            <a onClick={() => navigateToPost(prevPost.id)}><h4>{prevPost.title}</h4></a>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 nav-right flex-row d-flex justify-content-end align-items-center">
                      {nextPost && (
                        <>
                          <div className="detials">
                            <p>Next Post</p>
                            <a onClick={() => navigateToPost(nextPost.id)}><h4>{nextPost.title}</h4></a>
                          </div>
                          <div className="arrow">
                            <a onClick={() => navigateToPost(nextPost.id)}><span className="lnr text-white ti-arrow-right"></span></a>
                          </div>
                          <div className="thumb">
                            <a onClick={() => navigateToPost(nextPost.id)}><img className="img-fluid" src={nextPost.imageUrl || "/assets/img/post/next.png"} style={{ width: '60px' }} alt="" /></a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {author && (
                <div className="blog-author">
                  <div className="media align-items-center">
                    <img src={author.profilePicture} alt={author.name} className="img-fluid rounded-circle" style={{ width: '150px', height: '150px' }} />
                    <div className="media-body">
                      <a href="#"><h4>{author.name}</h4></a>
                      <p>{author.about}</p>
                    </div>
                  </div>
                </div>
              )}
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
  )
}

export default SingleBlog;