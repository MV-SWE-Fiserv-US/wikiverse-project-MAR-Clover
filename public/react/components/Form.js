import React from 'react';

export const Form = ({ setTitle, setName, setEmail, setContent, setTags, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        onSubmit();
      }}
    >
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          placeholder="Enter content"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tags">Tags:</label>
        <input
          type="text"
          id="tags"
          placeholder="Enter tags (comma-separated)"
          onChange={(e) => setTags(e.target.value.split(','))}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
