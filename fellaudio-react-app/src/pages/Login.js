import React, { useContext, useState } from 'react';
import '../styles/Login.css'; // Add necessary styles
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = ({ onLogin, onExitLoginPopup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
    console.log(success)
    if(success?.admin)
      navigate('/admin/panel')
    else
      navigate('/')
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Пошта:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Увійти</button>
        <div className='registerText'>
          <p>Не маєте акаунта?</p>
          <Link to="profile?create=true" onClick={onExitLoginPopup}>Зареєструйтесь зараз!</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
