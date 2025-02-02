import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { app } from '../../Firebase/firebase'; // Import your Firebase app configuration


function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const db = getFirestore();
      const blogsCollection = collection(db, 'ntblogs');
      const q = query(blogsCollection);
      const querySnapshot = await getDocs(q);

      const blogsData = [];
      querySnapshot.forEach((doc) => {
        blogsData.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched blogs: ", blogsData);
      setBlogs(blogsData);  // Set the blogs state
    };

    fetchBlogs();
  }, []);  


  return (

    <>
      {/* <!-- Hero Area Start--> */}
      <div class="slider-area ">
        <div class="single-slider section-overly slider-height2 d-flex align-items-center" data-background="assets/img/hero/about.jpg">
          <div class="container">
            <div class="row">
              <div class="col-xl-12">
                <div class="hero-cap text-center">
                  <h2>Single Blog</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Hero Area End --> */}
      {/* <!--================Blog Area =================--> */}
      <section class="blog_area section-padding">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mb-5 mb-lg-0">
              <div class="blog_left_sidebar">
                <article class="blog_item">
                  <div class="blog_item_img">
                    <img class="card-img rounded-0" src="assets/img/blog/single_blog_1.png" alt="" />
                    <a href="#" class="blog_item_date">
                      <h3>15</h3>
                      <p>Jan</p>
                    </a>
                  </div>

                  <div class="blog_details">
                    <a class="d-inline-block" href="single-blog.html">
                      <h2>Google inks pact for new 35-storey office</h2>
                    </a>
                    <p>That dominion stars lights dominion divide years for fourth have don't stars is that
                      he earth it first without heaven in place seed it second morning saying.</p>
                    <ul class="blog-info-link">
                      <li><a href="#"><i class="fa fa-user"></i> Travel, Lifestyle</a></li>
                      <li><a href="#"><i class="fa fa-comments"></i> 03 Comments</a></li>
                    </ul>
                  </div>
                </article>

                {blogs.map((blog, index) => (
                  <article className="blog_item" key={index}>
                    <div className="blog_item_img">
                      <img
                        className="card-img rounded-0"
                        src={blog.imageUrl || 'default-image.jpg'}
                        alt={blog.title}
                      />
                      <a href="#" className="blog_item_date">
                        <h3>{new Date(blog.createdAt.seconds * 1000).getDate()}</h3>  {/* Display date */}
                        <p>{new Date(blog.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' })}</p>
                      </a>
                    </div>

                    <div className="blog_details">
                      <a className="d-inline-block" href={`single-blog/${blog.id}`}>
                        <h2>{blog.title}</h2>
                      </a>
                      {/* <p>{blog.content && blog.content.substring(0, 200)}...</p> Display part of the content */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: blog.content ? blog.content.substring(0, 150) + '...' : ''
                        }}
                      />

                      <ul className="blog-info-link">
                        <li><a href="#"><i className="fa fa-user"></i> {blog.authorName  || "Unknown"}</a></li>
                        <li><a href="#"><i className="fa fa-hashtag"></i> {blog.category}</a></li>
                        <li><a href="#"><i className="fa fa-comments"></i> {blog.tags.length} Comments</a></li>
                      </ul>
                    </div>
                  </article>
                ))}

                <nav class="blog-pagination justify-content-center d-flex">
                  <ul class="pagination">
                    <li class="page-item">
                      <a href="#" class="page-link" aria-label="Previous">
                        <i class="ti-angle-left"></i>
                      </a>
                    </li>
                    <li class="page-item">
                      <a href="#" class="page-link">1</a>
                    </li>
                    <li class="page-item active">
                      <a href="#" class="page-link">2</a>
                    </li>
                    <li class="page-item">
                      <a href="#" class="page-link" aria-label="Next">
                        <i class="ti-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="blog_right_sidebar">
                <aside class="single_sidebar_widget search_widget">
                  <form action="#">
                    <div class="form-group">
                      <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder='Search Keyword'
                          onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Search Keyword'" />
                        <div class="input-group-append">
                          <button class="btns" type="button"><i class="ti-search"></i></button>
                        </div>
                      </div>
                    </div>
                    <button class="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                      type="submit">Search</button>
                  </form>
                </aside>

                <aside class="single_sidebar_widget post_category_widget">
                  <h4 class="widget_title">Category</h4>
                  <ul class="list cat-list">
                    <li>
                      <a href="#" class="d-flex">
                        <p>Resaurant food</p>
                        <p>(37)</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="d-flex">
                        <p>Travel news</p>
                        <p>(10)</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="d-flex">
                        <p>Modern technology</p>
                        <p>(03)</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="d-flex">
                        <p>Product</p>
                        <p>(11)</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="d-flex">
                        <p>Inspiration</p>
                        <p>21</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="d-flex">
                        <p>Health Care (21)</p>
                        <p>09</p>
                      </a>
                    </li>
                  </ul>
                </aside>

                <aside class="single_sidebar_widget popular_post_widget">
                  <h3 class="widget_title">Recent Post</h3>
                  <div class="media post_item">
                    <img src="assets/img/post/post_1.png" alt="post" />
                    <div class="media-body">
                      <a href="single-blog.html">
                        <h3>From life was you fish...</h3>
                      </a>
                      <p>January 12, 2019</p>
                    </div>
                  </div>
                  <div class="media post_item">
                    <img src="assets/img/post/post_2.png" alt="post" />
                    <div class="media-body">
                      <a href="single-blog.html">
                        <h3>The Amazing Hubble</h3>
                      </a>
                      <p>02 Hours ago</p>
                    </div>
                  </div>
                  <div class="media post_item">
                    <img src="assets/img/post/post_3.png" alt="post" />
                    <div class="media-body">
                      <a href="single-blog.html">
                        <h3>Astronomy Or Astrology</h3>
                      </a>
                      <p>03 Hours ago</p>
                    </div>
                  </div>
                  <div class="media post_item">
                    <img src="assets/img/post/post_4.png" alt="post" />
                    <div class="media-body">
                      <a href="single-blog.html">
                        <h3>Asteroids telescope</h3>
                      </a>
                      <p>01 Hours ago</p>
                    </div>
                  </div>
                </aside>
                <aside class="single_sidebar_widget tag_cloud_widget">
                  <h4 class="widget_title">Tag Clouds</h4>
                  <ul class="list">
                    <li>
                      <a href="#">project</a>
                    </li>
                    <li>
                      <a href="#">love</a>
                    </li>
                    <li>
                      <a href="#">technology</a>
                    </li>
                    <li>
                      <a href="#">travel</a>
                    </li>
                    <li>
                      <a href="#">restaurant</a>
                    </li>
                    <li>
                      <a href="#">life style</a>
                    </li>
                    <li>
                      <a href="#">design</a>
                    </li>
                    <li>
                      <a href="#">illustration</a>
                    </li>
                  </ul>
                </aside>


                <aside class="single_sidebar_widget instagram_feeds">
                  <h4 class="widget_title">Instagram Feeds</h4>
                  <ul class="instagram_row flex-wrap">
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_5.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_6.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_7.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_8.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_9.png" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img class="img-fluid" src="assets/img/post/post_10.png" alt="" />
                      </a>
                    </li>
                  </ul>
                </aside>


                <aside class="single_sidebar_widget newsletter_widget">
                  <h4 class="widget_title">Newsletter</h4>

                  <form action="#">
                    <div class="form-group">
                      <input type="email" class="form-control" onfocus="this.placeholder = ''"
                        onblur="this.placeholder = 'Enter email'" placeholder='Enter email' required />
                    </div>
                    <button class="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                      type="submit">Subscribe</button>
                  </form>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--================Blog Area =================--> */}
    </>
  )
}

export default BlogList