import React, { useState, useEffect } from 'react';
import '../../styles/Content.css';
import ContentDisplay from './templates/ContentDisplay';
import ContentCreate from './templates/ContentCreate'; // Assuming ContentCreate component exists
import ContentEdit from './templates/ContentEdit';

function Content() {
  // State to determine which component to render
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Parse URL search params
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get('edit');
    const createParam = params.get('create');

    if (editParam === 'true') {
      setShouldRender("edit");
    } else if (createParam === 'true') {
      setShouldRender("create");
    } else {
      setShouldRender("display")
    }
  }, []);

  return (
    <div>
      {shouldRender === 'edit' ? (
        <ContentEdit />
      ) : (shouldRender === 'create' ? (
        <ContentCreate />
      ) : (
        <ContentDisplay />
      ))}
    </div>
  );
}

export default Content;
