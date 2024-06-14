import React, { useState, useEffect } from 'react';
import ProfileDummyImage from '../../../assets/profile-dummy.jpg';
import '../../../styles/ProfileEdit.css';
import { toast } from 'react-toastify';

const ApiUrl = process.env.REACT_APP_API_URL;

function ProfileEdit({onRegister=null}) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            setError('Заповніть усі необхідні поля');
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Паролі не співпадають");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            formData.append('email', email);
            formData.append('image', imageFile);
            formData.append('password', password);

            const body = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                hashedPassword: password
            }

            const response = await fetch(`${ApiUrl}/User`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(body),
            });

            if (response.status === 422) {
                setError('Користувач з такою поштою вже існує');
                toast.error('Користувач з такою поштою вже існує');
            } else if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const user = await response.json()
            
            onRegister(user)

            toast.success('Ви успішно зареєструвались');
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Не вдалося створити користувача');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profileEdit">
            <div className="profileRow">
                <div className="profileImage">
                    <img src={imageFile || ProfileDummyImage} alt='Profile' />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {error && <p className="error">{error}</p>}
                </div>
                <div className="detailsBlock">
                    <h2>Введіть ваше ім'я та прізвище:</h2>
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
                    <h2>Введіть вашу пошту:</h2>
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
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Реєстрація...' : 'Зареєструватись'}
            </button>
        </form>
    );
}

export default ProfileEdit;
