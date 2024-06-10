import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPlaylistSaved = localStorage.getItem('playlistSaved');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.playlistSaved = JSON.parse(storedPlaylistSaved)
      setUser(parsedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
