import React from 'react';

export const Page = ({ page, getDetails }) => {
  return (
    <div>
      <h3>{page.title}</h3>
      <button onClick={() => getDetails(page.slug)}>View Details</button>
    </div>
  );
};
