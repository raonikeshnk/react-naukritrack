import React,  { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ searchTerm, handleSearch, searchResults, categories, recentPosts, formatDate }) {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter email submitted:', email);
        // Here, you could add logic to send this email to your backend or a third-party service
        setEmail('');
    };

    return (
        <div className="blog_right_sidebar">
            <aside className="single_sidebar_widget search_widget">
                <div className="form-group">
                    <label htmlFor="search">Search Blog</label>
                    <input
                        type="text"
                        id="search"
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder='Search blog...'
                    />
                </div>
                {searchResults.length > 0 && (
                    <ul className="list-group">
                        {searchResults.map(result => (
                            <li key={result.id} className="list-group-item">
                                <Link to={`/singleblog/${result.id}`} className="text-dark">{result.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            <aside className="single_sidebar_widget post_category_widget">
                <h4 className="widget_title">Category</h4>
                <ul className="list cat-list">
                    {categories.map(([category, count]) => (
                        <li key={category}>
                            <a href="#" className="d-flex">
                                <p>{category}</p>
                                <p>({count})</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>

            <aside className="single_sidebar_widget popular_post_widget">
                <h3 className="widget_title">Recent Post</h3>
                {recentPosts.map(post => (
                    <div className="media post_item" key={post.id}>
                        <img src={post.imageUrl || "/assets/img/post/post_1.png"} style={{ width: '80px' }} alt="post" />
                        <div className="media-body">
                            <Link to={`/singleblog/${post.id}`}><h3>{post.title}</h3></Link>
                            <p>{formatDate(post.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </aside>

            {/* <aside className="single_sidebar_widget instagram_feeds">
        <h4 className="widget_title">Instagram Feeds</h4>
        <ul className="instagram_row flex-wrap">
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_5.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_6.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_7.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_8.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_9.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img className="img-fluid" src="/assets/img/post/post_10.png" alt="" />
            </a>
          </li>
        </ul>
      </aside> */}

            <aside className="single_sidebar_widget newsletter_widget">
                <h4 className="widget_title">Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Enter email'}
                            placeholder='Enter email'
                            required
                        />
                    </div>
                    <button className="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                        type="submit">Subscribe</button>
                </form>
            </aside>
        </div>
    );
}

export default Sidebar;