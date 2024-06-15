import React, { useEffect, useState } from 'react';
import '../../styles/Panel.css';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import GridViewIcon from '@mui/icons-material/GridView';
import ContentTable from './templates/ContentTable';
import UserTable from './templates/UserTable';
import LocationTable from './templates/LocationTable';
import { useNavigate } from 'react-router-dom';

function Panel() {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('contents');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const display = params.get('display');
    if (display) {
      setSelectedComponent(display);
    }
  }, []);

  useEffect(() => {
    navigate(`/admin/panel?display=${selectedComponent}`);
  }, [selectedComponent, navigate]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'contents':
        return <ContentTable />;
      case 'users':
        return <UserTable />;
      case 'locations':
        return <LocationTable />;
      default:
        return
    }
  };

  return (
    <div className='adminPanel'>
      <aside className='leftPanel'>
        <table>
          <tbody>
            <tr onClick={() => setSelectedComponent('contents')}>
              <td>
                <GridViewIcon /> <span>Contents</span>
              </td>
            </tr>
            <tr onClick={() => setSelectedComponent('users')}>
              <td>
                <PeopleOutlineIcon /><span>Users</span>
              </td>
            </tr>
            <tr onClick={() => setSelectedComponent('locations')}>
              <td>
                <AddLocationAltIcon /><span>Locations</span>
              </td>
            </tr>
          </tbody>
        </table>
      </aside>
      <main className='panelContent'>
        <h1>Вітаємо вас на адмінпанелі!</h1>
        {renderComponent()}
      </main>
    </div>
  );
}

export default Panel;
