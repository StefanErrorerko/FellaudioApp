import React from 'react';
import { UserList } from '../helpers/userList';
import '../styles/Profile.css';

function Profile() {
  // Assume we're using the first user for demonstration
  const user = UserList[0];

  return (
    <div className="profileContainer">
      {/* First row */}
      <div className="profileRow">
        {/* Profile image block (square, empty) */}
        <div className="profileImage"></div>
        {/* Details block */}
        <div className="detailsBlock">
          <div className="detailsRow">
            <h1>{user.firstname} {user.surname}</h1>
          </div>
          <div className="detailsRow">
            <p>{user.description}</p>
          </div>
          <div className="detailsRow">
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="contentsRow">
        <div className="contentsContainer">
            <div className="contentsTitle">
            <h2>Contents</h2>
            </div>
            <div className="contentBlocks">
            {/* Three empty blocks */}
            <div className="contentBlock"></div>
            <div className="contentBlock"></div>
            <div className="contentBlock"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
