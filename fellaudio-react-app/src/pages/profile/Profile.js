import React, { useState, useEffect } from 'react';
import '../../styles/Profile.css';
import ProfileDisplay from './templates/ProfileDisplay';
import ProfileEdit from './templates/ProfileEdit'; // Assuming ContentCreate component exists

function Profile() {
  const [shouldRenderCreate, setShouldRenderCreate] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const createParam = params.get('edit');

    if (createParam === 'true') {
      setShouldRenderCreate(true);
    } else {
      setShouldRenderCreate(false);
    }
  }, []);

  return (
    <div>
      {shouldRenderCreate ? (
        <ProfileEdit />
      ) : (
        <ProfileDisplay />
      )}
    </div>
  );
}

export default Profile;
