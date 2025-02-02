import React from 'react';

const Modal = ({ isOpen, onClose, blog }) => {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyles}>
            <div style={modalContentStyles}>
                <div style={scrollableContentStyles}>
                    <button onClick={onClose} style={closeButtonStyles}>X</button>

                    <h2 style={titleStyle}>{blog?.title || 'No Title'}</h2>

                    <div style={imageContainerStyles}>
                        <img
                            src={blog?.imageUrl || 'https://via.placeholder.com/300'}
                            alt={blog?.title || 'No Title'}
                            style={imageStyles}
                        />
                    </div>

                    <p><strong>Category:</strong> {blog?.category || 'No Category'}</p>
                    <p><strong>Author:</strong> {blog?.authorName || 'Unknown'}</p>
                    <p><strong>Created On:</strong>
                        {blog?.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </p>
                    <p><strong>Tags:</strong> {blog?.tags?.filter(tag => tag.trim()).join(', ') || 'No Tags'}</p>

                    <p><strong>Description:</strong></p>
                    {blog?.content ? (
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    ) : (
                        <p>No Description</p>
                    )}
                </div>
                <div style={watermarkStyles}></div> {/* Watermark */}
            </div>
        </div>
    );
};

// Styles
const modalOverlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyles = {
    background: 'white',
    padding: '20px',
    maxWidth: '80%',
    width: '100%',
    maxHeight: '80vh',
    borderRadius: '8px',
    overflowY: 'hidden', // Hide overflow of the modal itself
    position: 'relative',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 2,
};

const scrollableContentStyles = {
    position: 'relative',
    zIndex: 2,
    overflowY: 'auto', // Allow scrolling inside the content
    maxHeight: 'calc(80vh - 50px)', // Adjust this depending on the space for other content like button
    paddingBottom: '20px', // Space for watermark
};

const watermarkStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/assets/img/logo/naukri-track.png")',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat', // Repeat watermark vertically
    opacity: 0.04, // Adjust opacity as needed
    pointerEvents: 'none', // Prevent watermark from interfering with interactions
    zIndex: 2, // Place the watermark behind the content
};

const imageContainerStyles = {
    textAlign: 'center',
    marginBottom: '20px',
};

const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const closeButtonStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    padding: '5px 10px',
    cursor: 'pointer',
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '15px',
};

export default Modal;
