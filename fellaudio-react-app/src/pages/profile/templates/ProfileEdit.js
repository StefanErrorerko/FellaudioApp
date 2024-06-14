import React, { useState, useEffect, useContext, useRef } from 'react';
import ProfileDummyImage from '../../../assets/profile-dummy.jpg';
import '../../../styles/Profile.css';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import FloatingEditButton from '../../../components/FloatingEditButton';
import { UserContext, updateContext } from '../../../context/UserContext';
import { xor } from '../../../utils/LogicalOperations';

const ApiUrl = process.env.REACT_APP_API_URL;

function ProfileEdit() {
    const {user} = useContext(UserContext)

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null)

    const navigate = useNavigate()

    const { userId } = useParams()

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            setError('Фото має бути меншим за 5 МБайт');
            setImageFile(null);
            return;
        }

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageFile(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleEditClick = async () => {

        if (!firstname || !lastname || !email || xor(password, confirmPassword)) {
            toast.error('Заповніть усі необхідні поля');
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Паролі не співпадають");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let body = {}
            body.firstname = firstname.trim()
            body.lastname = lastname.trim()
            body.email = email.trim()

            if(password !== '' && confirmPassword !== '')
                body.hashedPassword = password

            const response = await fetch(`${ApiUrl}/User/${userId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedUser = await response.json()

            updateContext(updatedUser)

            navigate(`/profile/${userId}`)
            window.location.reload();        
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Не вдалося оновити дані');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchContents = async () => {
          try{
            if(user){
                setEmail(user.email)
                setFirstname(user.firstname)
                setLastname(user.lastname)
            }
          } 
          catch (err) {
            setError(err)
          } 
          finally {
            setIsLoading(false)
          }
        }
    
        fetchContents()
      }, [user])  
    
      if (isLoading) {
        return <div>Loading...</div>
      }
    
      if (error) {
        console.log(error)
        return <div>Something went wrong. Please try again</div>
      }

    return (
        <div className="profileEdit">
            <div className="profileRow">
                <div className="profileImage">
                    <img src={imageFile || ProfileDummyImage} alt='Profile' />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="detailsBlock">
                    <h2>Змініть ваше ім'я/прізвище</h2>
                    <div className="fullnameRow">
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Пилип"
                            required
                        />
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="Прилипчук"
                            required
                        />
                    </div>
                    <h2>Введіть нову поштову адресу:</h2>
                    <div className="emailRow">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="otakoi@poshta.ua"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            title="Будь ласка, введіть дійсну електронну адресу"
                        />
                    </div>
                    <h2>Введіть новий пароль:</h2>
                    <div className="passwordRow">
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Введіть пароль"
                            required
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Підтвердіть пароль"
                            required
                        />
                    </div>
                </div>
            </div>

            <FloatingEditButton 
                handleOnClick={handleEditClick}
                isEditing={true}
            />
        </div>
    );
}

export default ProfileEdit;
