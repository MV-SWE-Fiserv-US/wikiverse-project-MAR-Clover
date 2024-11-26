import React, { useState, useEffect } from 'react';
import { PagesList } from './PagesList';
import {Form} from './Form';

import apiURL from '../api';


export const App = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);

  //state variables for forms:
  const [displayForm, setDisplayForm] = useState(false)
  //if the above displayForm is true, display <Form/>  --> this can be done using ternary operators

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");




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
  }, [displayForm]);

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

  async function onSubmit() {
    try {
      const response = await fetch(`${apiURL}/wiki/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          content: content,
          name: name,
          email: email,
          tags: tags
        })
      });
  
      if (!response.ok) {
        console.log("Failed to add article:", response.statusText);
      } else {
        const data = await response.json();
        console.log("Article added successfully:", data);
      }
    } catch (err) {
      console.log("Error occurred when adding article:", err);
    }
  }
  


  async function deleteItem (itemToDelete) {
    try{
      const response = await fetch(`${apiURL}/wiki/${itemToDelete}`, {
        method: "DELETE",
      });
      const data = await response.json();
      //since the delete method returns an updated list of pages we can set pages here to data
      setPages(data)
      console.log(data);
      //setting current page to null should make the ternary display list of pages instead of single page view
      setCurrentPage(null)
      
    }catch(err){
      console.log("error deleting item", err)
    }
  }

  return (
<main>
    <h1>WikiVerse</h1>
    <h2>An interesting 📚</h2>
    {currentPage ? (
      <div>
        <h2>{currentPage.title}</h2>
        <p>Author: {currentPage.author.name}</p>
        <p>Published: {new Date(currentPage.createdAt).toLocaleDateString()}</p>
        <p>Content: {currentPage.content}</p>
        <p>Tags:</p>
        {currentPage.tags.map((tag) => (
          <p key={tag.name}>{tag.name}</p>
        ))}
        <button onClick={() => setCurrentPage(null)}>Back to Wiki List</button>
        <button onClick={()=> deleteItem(currentPage.slug)}> DELETE </button>
      </div>
    ) : (
      <>
        {displayForm ? (
          <>
            <Form 
            setTitle = {setTitle} 
            setContent={setContent} 
            setName={setName} 
            setEmail={setEmail} 
            setTags={setTags}
            onSubmit={onSubmit}
            />
             <button onClick={() => setDisplayForm(false)}>Cancel </button>
          </>
        ) : (
          <>
            <PagesList
              pages={pages}
              setCurrentPage={setCurrentPage}
              getDetails={getDetails}
            />
            <button onClick={() => setDisplayForm(true)}>Add Page</button>
           
          </>
        )}
      </>
    )}
  </main>
  );
};

