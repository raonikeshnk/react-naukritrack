import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EditBlog = ({ blog, onUpdate, onCancel }) => {
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [category, setCategory] = useState(blog.category || '');
    const [tags, setTags] = useState(blog.tags.join(', '));

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedData = {
            title,
            content,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
        };

        try {
            onUpdate(blog.id, updatedData);
            toast.success('Blog saved successfully!'); // Success toast
        } catch (error) {
            toast.error('Failed to save blog. Please try again.'); // Error toast
        }
    };

    return (
        <div className="container">
            <h2>Edit Blog</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Save Changes
                </button>
                <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
