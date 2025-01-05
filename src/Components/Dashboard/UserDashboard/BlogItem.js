import React from 'react';

const BlogItem = ({ blog, index, onDelete, onEdit, onPublish, onUnpublish, onPreview }) => {

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {blog.imageUrl ? (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            style={{ width: '100px', height: '60px', objectFit: 'cover' }}
          />
        ) : (
          'No Image'
        )}
      </td>
      <td>{blog.title}</td>
      <td>{blog.category || 'Uncategorized'}</td>
      <td>
        {blog.tags && blog.tags.length > 0 ? (
          blog.tags.map((tag, idx) => (
            <span key={idx} className="badge bg-primary me-1">
              {tag}
            </span>
          ))
        ) : (
          'No Tags'
        )}
      </td>
      {/* <td>{blog.content.substring(0, 80)}...</td> */}
      <td>{blog.createdAt && new Date(blog.createdAt.seconds * 1000).toLocaleString('en-US', { hour12: true })}</td>

      <td>
        <span className={`badge ${blog.isPublished ? 'bg-success' : 'bg-secondary'}`}>
          {blog.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        {!blog.isPublished ? (
          <button
            className="btn-success btn-sm"
            onClick={() => onPublish(blog.id)}
          >
            Publish
          </button>
        ) : (
          <button
            className="btn-warning btn-sm"
            onClick={() => onUnpublish(blog.id)}
          >
            Unpublish
          </button>
        )}
        {/* Preview button */}
        <button className="btn-sm btn-info" onClick={() => onPreview(blog)}>
          Preview
        </button>
        <button className="btn-warning btn-sm" onClick={() => onEdit(blog)}>
          Edit
        </button>
        <button className="btn-danger btn-sm" onClick={() => onDelete(blog.id)}>
          Delete
        </button>


      </td>
    </tr>
  );
};

export default BlogItem;
