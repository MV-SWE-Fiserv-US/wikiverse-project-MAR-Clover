import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';

// Import and prepend the API URL to any fetch calls
import apiURL from '../api';

export const App = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);

  async function fetchPages() {
    try {
      const response = await fetch(`${apiURL}/wiki`);
      const pagesData = await response.json();
      setPages(pagesData);
    } catch (err) {
      console.log('Oh no, an error! ', err);
    }
  }

  useEffect(() => {
    fetchPages();
  }, []);

  async function getDetails(slug) {
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      const data = await response.json();
      console.log(data)
      setCurrentPage(data); 
    } catch (error) {
      console.log('ERROR FETCHING SLUG: ' + error);
    }
  }

  return (
    <main>
      <h1>WikiVerse</h1>
      <h2>An interesting 📚</h2>
      {currentPage ? (
        <div>
          <button onClick={() => setCurrentPage(null)}>Back to Wiki List</button>
          <h2>{currentPage.title}</h2>
          <p>Author: {currentPage.author.name}</p>
          <p>Published: {new Date(currentPage.createdAt).toLocaleDateString()}</p>
          <p>Content: {currentPage.content}</p>
          <p>Tags:</p>
            {currentPage.tags.map((tag) => (
              <p key={tag.name}>{tag.name}</p>
            ))}
        </div>
      ) : (
        <PagesList
          pages={pages}
          setCurrentPage={setCurrentPage}
          getDetails={getDetails}
        />
      )}
    </main>
  );
};

// Title
// Author
// Content
// Tags
// Date (createdAt)