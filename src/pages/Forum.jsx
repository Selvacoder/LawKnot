import React, { useState } from 'react';
import './Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Contract Law: Breach of Non-Disclosure Agreement",
      content: "I have a client who signed an NDA but has disclosed confidential information. What are the immediate steps we should take?",
      author: "Sarah Miller",
      role: "Corporate Lawyer",
      timestamp: "2 hours ago",
      replies: 5,
      likes: 12,
      category: "Contract Law"
    },
    {
      id: 2,
      title: "Employment Law: Remote Work Policies",
      content: "With the rise of remote work, what legal considerations should companies keep in mind when drafting remote work policies?",
      author: "Michael Chen",
      role: "Employment Attorney",
      timestamp: "4 hours ago",
      replies: 8,
      likes: 18,
      category: "Employment Law"
    },
    {
      id: 3,
      title: "IP Law: Trademark vs Copyright Confusion",
      content: "A client is confused about the difference between trademark and copyright protection for their brand assets. How do you explain this clearly?",
      author: "Emma Thompson",
      role: "IP Specialist",
      timestamp: "6 hours ago",
      replies: 3,
      likes: 7,
      category: "Intellectual Property"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  const categories = ['All', 'Contract Law', 'Employment Law', 'Intellectual Property', 'Criminal Law', 'Family Law', 'Real Estate', 'Tax Law', 'General'];

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "You",
      role: "Legal Professional",
      timestamp: "Just now",
      replies: 0,
      likes: 0,
      category: newPost.category
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'General' });
    setShowNewPostForm(false);
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="forum-header">
        <h1 className="page-title">Legal Forum</h1>
        <p className="page-subtitle">
          Connect with legal professionals, share experiences, and get insights from the community.
        </p>
        <button 
          className="btn new-post-btn"
          onClick={() => setShowNewPostForm(true)}
        >
          <span>📝</span>
          New Discussion
        </button>
      </div>

      <div className="forum-container">
        <div className="forum-sidebar">
          <div className="categories-section">
            <h3>Categories</h3>
            <div className="categories-list">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="forum-stats">
            <h3>Forum Stats</h3>
            <div className="stat-item">
              <span className="stat-number">1,234</span>
              <span className="stat-label">Total Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">456</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">89</span>
              <span className="stat-label">Online Now</span>
            </div>
          </div>
        </div>

        <div className="forum-main">
          <div className="posts-header">
            <h2>
              {selectedCategory === 'All' ? 'All Discussions' : selectedCategory}
              <span className="posts-count">({filteredPosts.length} posts)</span>
            </h2>
            <div className="sort-options">
              <select className="sort-select">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Most Replies</option>
              </select>
            </div>
          </div>

          <div className="posts-list">
            {filteredPosts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-category">{post.category}</div>
                  <div className="post-timestamp">{post.timestamp}</div>
                </div>
                
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
                
                <div className="post-footer">
                  <div className="post-author">
                    <div className="author-avatar">👤</div>
                    <div className="author-info">
                      <div className="author-name">{post.author}</div>
                      <div className="author-role">{post.role}</div>
                    </div>
                  </div>
                  
                  <div className="post-actions">
                    <button className="action-btn">
                      <span>👍</span>
                      {post.likes}
                    </button>
                    <button className="action-btn">
                      <span>💬</span>
                      {post.replies}
                    </button>
                    <button className="action-btn">
                      <span>🔗</span>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNewPostForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Start New Discussion</h2>
              <button 
                className="close-btn"
                onClick={() => setShowNewPostForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="new-post-form">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="form-input"
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="What's your question or topic?"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Provide details about your question or share your insights..."
                  className="form-input"
                  rows="6"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewPostForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;