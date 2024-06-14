import React, { useState, useEffect } from 'react';
import '../../styles/Profile.css';
import ProfileDisplay from './templates/ProfileDisplay';
import ProfileEdit from './templates/ProfileEdit'; // Assuming ContentCreate component exists

function Profile({onRegister}) {
  const [shouldRender, setShouldRender] = useState();

  useEffect(() => {
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
        <ProfileEdit />
      ) : (shouldRender === 'create' ? (
        <ProfileEdit onRegister={onRegister} />
      ) : (
        <ProfileDisplay />
      ))}
    </div>
  );
}

export default Profile;
