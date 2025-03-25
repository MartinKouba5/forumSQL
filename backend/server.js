const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: 'root',
  password: '',
  database: 'forumsql'
});

// Helper function for queries
const runQuery = async (query, params = []) => {
  const [rows] = await pool.query(query, params);
  return rows;
};

// Routes
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await runQuery(
      'INSERT INTO posts (title, content) VALUES (?, ?)',
      [title, content]
    );
    res.status(201).json({ id: result.insertId, title, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts', async (req, res) => {
  const { sort } = req.query;

  try {
    let query = `
      SELECT p.*, COUNT(c.id) AS comment_count 
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
    `;

    if (sort === 'comments') {
      query += ' ORDER BY comment_count DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    const posts = await runQuery(query);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content, parentCommentId } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const result = await runQuery(
      'INSERT INTO comments (post_id, content, parent_comment_id) VALUES (?, ?, ?)',
      [postId, content, parentCommentId || null]
    );
    res.status(201).json({
      id: result.insertId,
      post_id: postId,
      content,
      parent_comment_id: parentCommentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await runQuery(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
      [postId]
    );

    const buildCommentTree = (comments, parentId = null) => {
      return comments
        .filter(comment => comment.parent_comment_id === parentId)
        .map(comment => ({
          ...comment,
          replies: buildCommentTree(comments, comment.id)
        }));
    };

    res.json(buildCommentTree(comments));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});