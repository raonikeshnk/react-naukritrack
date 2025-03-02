import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* <!-- Footer Start--> */}
            <div className="footer-area footer-bg footer-padding">
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                            <div className="single-footer-caption mb-50">
                                <div className="single-footer-caption mb-30">
                                    <div className="footer-tittle">
                                        <h4>About Us</h4>
                                        <div className="footer-pera">
                                            <p>Heaven fruitful doesn't cover lesser days appear creeping seasons so behold.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Contact Info</h4>
                                    <ul>
                                        <li>
                                            <p>Address: Your address goes here, your demo address.</p>
                                        </li>
                                        <li><button onClick={() => window.location.href = 'tel:+888044338899'}>Phone: +8880 44338899</button></li>
                                        <li><button onClick={() => window.location.href = 'mailto:info@colorlib.com'}>Email: info@colorlib.com</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Important Link</h4>
                                    <ul>
                                        <li><button onClick={() => window.location.href = '#'}>View Project</button></li>
                                        <li><button onClick={() => window.location.href = '#'}>Contact Us</button></li>
                                        <li><button onClick={() => window.location.href = '#'}>Testimonial</button></li>
                                        <li><button onClick={() => window.location.href = '#'}>Properties</button></li>
                                        <li><button onClick={() => window.location.href = '#'}>Support</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="single-footer-caption mb-50">
                                <div className="footer-tittle">
                                    <h4>Newsletter</h4>
                                    <div className="footer-pera footer-pera2">
                                        <p>Heaven fruitful doesn't over lesser in days. Appear creeping.</p>
                                    </div>
                                    {/* <!-- Form --> */}
                                    <div className="footer-form">
                                        <div id="mc_embed_signup">
                                            <form
                                                target="_blank"
                                                action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                                                method="get"
                                                className="subscribe_form relative mail_part"
                                            >
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="newsletter-form-email"
                                                    placeholder="Email Address"
                                                    className="placeholder hide-on-focus"
                                                    onFocus={() => (document.getElementById('newsletter-form-email').placeholder = '')}
                                                    onBlur={() => (document.getElementById('newsletter-form-email').placeholder = 'Email Address')}
                                                />
                                                <div className="form-icon">
                                                    <button
                                                        type="submit"
                                                        name="submit"
                                                        id="newsletter-submit"
                                                        className="email_icon newsletter-submit button-contactForm"
                                                    >
                                                        <img src="assets/img/icon/form.png" alt="" />
                                                    </button>
                                                </div>
                                                <div className="mt-10 info"></div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!--  --> */}
                    <div className="row footer-wejed justify-content-between">
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                            {/* <!-- logo --> */}
                            <div className="footer-logo mb-20">
                                <a href="index.html">
                                    <img src="assets/img/logo/naukri-track-white.png" alt="Naukri Track Logo" />
                                </a>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="footer-tittle-bottom">
                                <span>5000+</span>
                                <p>Talented Hunter</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            <div className="footer-tittle-bottom">
                                <span>451</span>
                                <p>Talented Hunter</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
                            {/* <!-- Footer Bottom Tittle --> */}
                            <div className="footer-tittle-bottom">
                                <span>568</span>
                                <p>Talented Hunter</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- footer-bottom area --> */}
            <div className="footer-bottom-area footer-bg">
                <div className="container">
                    <div className="footer-border">
                        <div className="row d-flex justify-content-between align-items-center">
                            <div className="col-xl-10 col-lg-10">
                                <div className="footer-copy-right">
                                    <p>
                                        Copyright &copy; {currentYear} All rights reserved.
                                    </p>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-2">
                                <div className="footer-social f-right">
                                    <button onClick={() => window.location.href = '#'}><i className="fab fa-facebook-f"></i></button>
                                    <button onClick={() => window.location.href = '#'}><i className="fab fa-twitter"></i></button>
                                    <button onClick={() => window.location.href = '#'}><i className="fas fa-globe"></i></button>
                                    <button onClick={() => window.location.href = '#'}><i className="fab fa-behance"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Footer End--> */}
        </>
    );
};

export default Footer;