import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Comment = ({ comment, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="comment" style={{ marginLeft: '30px' }}>
      <p>{comment.content}</p>
      <small>{new Date(comment.created_at).toLocaleString()}</small>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Zrušit' : 'Odpovědět'}
      </button>

      {showReplyForm && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
          />
          <button type="submit">Odeslat odpověď</button>
        </form>
      )}

      {comment.replies.map(reply => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          onReply={onReply} 
        />
      ))}
    </div>
  );
};

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch(`http://localhost:5000/api/posts/${postId}`);
        const postData = await postRes.json();
        setPost(postData);

        const commentsRes = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });
      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          parentCommentId: parentId 
        }),
      });
      const newReply = await response.json();
      setComments(prev => [...prev, newReply]);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>Posted: {new Date(post.created_at).toLocaleString()}</small>

      <div className="comments-section">
        <h2>Komentáře ({comments.length})</h2>
        
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Napište komentář..."
            required
          />
          <button type="submit">Přidat komentář</button>
        </form>

        <div className="comments-list">
          {comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onReply={handleReply} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;