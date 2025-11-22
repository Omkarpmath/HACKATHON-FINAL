const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Community {
    // Create a new community post
    static async createPost(postData) {
        const db = getDB();

        const post = {
            authorId: new ObjectId(postData.authorId),
            authorName: postData.authorName,
            title: postData.title || '',
            content: postData.content,
            category: postData.category || 'General', // Disease, Feed, Breeding, General
            likes: [],
            likeCount: 0,
            replies: [],
            replyCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('community_posts').insertOne(post);
        return { ...post, _id: result.insertedId };
    }

    // Get all posts sorted by newest first
    static async getAllPosts(filter = {}) {
        const db = getDB();
        const query = {};

        // Add category filter if provided
        if (filter.category && filter.category !== 'All') {
            query.category = filter.category;
        }

        // Add search filter if provided
        if (filter.search) {
            query.$or = [
                { title: { $regex: filter.search, $options: 'i' } },
                { content: { $regex: filter.search, $options: 'i' } }
            ];
        }

        return await db.collection('community_posts')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
    }

    // Get posts by author
    static async getPostsByAuthor(authorId) {
        const db = getDB();
        return await db.collection('community_posts')
            .find({ authorId: new ObjectId(authorId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    // Toggle like on a post
    static async toggleLike(postId, userId) {
        const db = getDB();
        const post = await db.collection('community_posts').findOne({ _id: new ObjectId(postId) });

        if (!post) return null;

        const userIdStr = userId.toString();
        const hasLiked = post.likes?.some(id => id.toString() === userIdStr);

        if (hasLiked) {
            // Unlike
            await db.collection('community_posts').updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: { likes: new ObjectId(userId) },
                    $inc: { likeCount: -1 },
                    $set: { updatedAt: new Date() }
                }
            );
            return { liked: false };
        } else {
            // Like
            await db.collection('community_posts').updateOne(
                { _id: new ObjectId(postId) },
                {
                    $push: { likes: new ObjectId(userId) },
                    $inc: { likeCount: 1 },
                    $set: { updatedAt: new Date() }
                }
            );
            return { liked: true };
        }
    }

    // Add reply to a post
    static async addReply(postId, replyData) {
        const db = getDB();

        const reply = {
            _id: new ObjectId(),
            authorId: new ObjectId(replyData.authorId),
            authorName: replyData.authorName,
            content: replyData.content,
            createdAt: new Date()
        };

        await db.collection('community_posts').updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: { replies: reply },
                $inc: { replyCount: 1 },
                $set: { updatedAt: new Date() }
            }
        );

        return reply;
    }

    // Delete a post
    static async deletePost(postId, authorId) {
        const db = getDB();
        const result = await db.collection('community_posts').deleteOne({
            _id: new ObjectId(postId),
            authorId: new ObjectId(authorId)
        });
        return result.deletedCount > 0;
    }
}

module.exports = Community;
