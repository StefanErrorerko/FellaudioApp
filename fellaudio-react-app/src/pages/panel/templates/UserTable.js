import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast module for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import '../../../styles/Panel.css'; 
import { useNavigate } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';

const ApiUrl = process.env.REACT_APP_API_URL;

function UserTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${ApiUrl}/User`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${ApiUrl}/User/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the user list after successful deletion
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleRowClick = (userId) => {
    navigate(`/profile/${userId}`)
  };

  return (
    <div className="userTableContainer">
      <div className="tableContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>Прізвище</th>
              <th>Е-пошта</th>
              <th>Створено</th>
              <th>Видалити</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Завантаження...</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td onClick={() => handleRowClick(user.id)}>{user.firstname}</td>
                  <td onClick={() => handleRowClick(user.id)}>{user.lastname}</td>
                  <td onClick={() => handleRowClick(user.id)}>{user.email}</td>
                  <td onClick={() => handleRowClick(user.id)}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="deleteUserButton"
                      onClick={() => deleteUser(user.id)}
                    >
                      <CancelIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
