import React, { useState, useEffect } from 'react';
import '../../styles/Content.css';
import ContentDisplay from './templates/ContentDisplay';
import ContentEdit from './templates/ContentEdit'; // Assuming ContentCreate component exists

function Content() {
  // State to determine which component to render
  const [shouldRenderCreate, setShouldRenderCreate] = useState(false);

  useEffect(() => {
    // Parse URL search params
    const params = new URLSearchParams(window.location.search);
    const createParam = params.get('edit');

    // Update state based on the query parameter
    if (createParam === 'true') {
      setShouldRenderCreate(true);
    } else {
      setShouldRenderCreate(false);
    }
  }, []);

  return (
    <div>
      {shouldRenderCreate ? (
        <ContentEdit />
      ) : (
        <ContentDisplay />
      )}
    </div>
  );
}

export default Content;
