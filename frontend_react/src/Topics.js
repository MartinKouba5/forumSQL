import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topics = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [sortedPosts, setSortedPosts] = useState([]); // Zde inicializujeme jako pole
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const sortParam = sortBy === 'comments' ? 'comments' : 'date';
        const response = await fetch(
          `http://localhost:5000/api/posts?sort=${sortParam}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Zajistíme, že data jsou vždy pole
        setSortedPosts(Array.isArray(data) ? data : []);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
        setSortedPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [sortBy]);

  if (loading) return <div>Načítání...</div>;
  if (error) return <div>Chyba: {error}</div>;

  return (
    <div className="topics">
      <div className="sort-controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Podle data</option>
          <option value="comments">Podle počtu komentářů</option>
        </select>
        <button onClick={() => navigate('/create')}>Vytvořit příspěvek</button>
      </div>

      {/* Bezpečné použití map() s kontrolou typu */}
      {Array.isArray(sortedPosts) && sortedPosts.map(post => (
        <div 
          key={post.id} 
          className="post-card" 
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h3>{post.title}</h3>
          <p>{post.content?.substring(0, 100)}...</p>
          <div className="post-meta">
            <span>Komentáře: {post.comment_count || 0}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Topics;