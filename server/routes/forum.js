const express = require('express');
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort = 'recent' } = req.query;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 }; // Default: most recent
    if (sort === 'popular') {
      sortOption = { likes: -1, createdAt: -1 };
    } else if (sort === 'replies') {
      sortOption = { 'replies.length': -1, createdAt: -1 };
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'firstName lastName role organization')
      .populate('replies.author', 'firstName lastName role')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ForumPost.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error retrieving forum posts' });
  }
});

// Create new forum post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = new ForumPost({
      title,
      content,
      author: req.userId,
      category: category || 'General',
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'firstName lastName role organization');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating forum post' });
  }
});

// Get single forum post
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'firstName lastName role organization')
      .populate('replies.author', 'firstName lastName role organization');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Error retrieving forum post' });
  }
});

// Add reply to forum post
router.post('/:id/replies', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = {
      author: req.userId,
      content,
      likes: []
    };

    post.replies.push(reply);
    await post.save();
    await post.populate('replies.author', 'firstName lastName role');

    res.status(201).json({
      message: 'Reply added successfully',
      reply: post.replies[post.replies.length - 1]
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Like/unlike forum post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.userId);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Error updating post likes' });
  }
});

module.exports = router;