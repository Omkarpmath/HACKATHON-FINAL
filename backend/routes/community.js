const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET: Community page
router.get('/community', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (search) filter.search = search;

        const posts = await Community.getAllPosts(filter);

        res.render('farmer/community', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            posts,
            currentCategory: category || 'All',
            searchQuery: search || ''
        });
    } catch (error) {
        console.error('❌ Error loading community:', error);
        res.status(500).render('error', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            message: 'Failed to load community'
        });
    }
});

// POST: Create a new post
router.post('/api/community/post', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Post content cannot be empty'
            });
        }

        const post = await Community.createPost({
            authorId: req.session.userId,
            authorName: req.session.userName,
            title: title?.trim() || '',
            content: content.trim(),
            category: category || 'General'
        });

        console.log(`✅ Community post created by ${req.session.userName}`);

        res.json({
            success: true,
            message: 'Post created successfully',
            post
        });

    } catch (error) {
        console.error('❌ Error creating post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create post'
        });
    }
});

// DELETE: Delete a post
router.delete('/api/community/post/:id', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Community.deletePost(id, req.session.userId);

        if (deleted) {
            res.json({
                success: true,
                message: 'Post deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Post not found or unauthorized'
            });
        }

    } catch (error) {
        console.error('❌ Error deleting post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete post'
        });
    }
});

// POST: Toggle like on a post
router.post('/api/community/post/:id/like', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Community.toggleLike(id, req.session.userId);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        res.json({
            success: true,
            liked: result.liked
        });

    } catch (error) {
        console.error('❌ Error toggling like:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle like'
        });
    }
});

// POST: Add reply to a post
router.post('/api/community/post/:id/reply', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Reply content cannot be empty'
            });
        }

        const reply = await Community.addReply(id, {
            authorId: req.session.userId,
            authorName: req.session.userName,
            content: content.trim()
        });

        res.json({
            success: true,
            message: 'Reply added successfully',
            reply
        });

    } catch (error) {
        console.error('❌ Error adding reply:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add reply'
        });
    }
});

module.exports = router;
