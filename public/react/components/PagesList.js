import React from 'react';
import { Page } from './Page';

export const PagesList = ({ pages, getDetails }) => {
  return (
    <>
      {pages.map((page, idx) => (
        <Page key={idx} page={page} getDetails={getDetails} />
      ))}
    </>
  );
};
