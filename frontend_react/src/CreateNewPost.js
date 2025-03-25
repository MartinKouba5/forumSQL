import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNewPost.css';

const topics = [
  { id: 1, title: 'Škola' },
  { id: 2, title: 'Práce' },
  { id: 3, title: 'Domov' },
  { id: 4, title: 'Cestování' },
  { id: 5, title: 'Technologie' },
  { id: 6, title: 'Zdraví' },
  { id: 7, title: 'Sport' },
  { id: 8, title: 'Kultura' },
  { id: 9, title: 'Věda' },
  { id: 10, title: 'Umění' },
];

const CreateNewPost = ({ addPost }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(topics[0].id);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      author,
      title,
      content,
      topicId: selectedTopic,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    addPost(newPost);
    navigate('/');
  };

  return (
    <div className="create-post-container">
      <h2>Vytvořit nový příspěvek</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">Autor:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="title">Nadpis:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Obsah:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="topic">Kategorie:</label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(Number(e.target.value))}
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Přidat příspěvek</button>
      </form>
    </div>
  );
};

export default CreateNewPost;
