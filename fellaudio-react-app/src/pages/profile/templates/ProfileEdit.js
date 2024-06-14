import React, { useState } from 'react'
import ProfileDummyImage from '../../../assets/profile-dummy.jpg'
import '../../../styles/ProfileEdit.css'

function ProfileEdit() {
    const [firstaname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [hashedPassword, setHashedPassword] = useState('')
    const [imageFile, setImageFile] = useState(null);

    return (
        <div className='profileEdit'>
        <div className="profileRow">
            <div className="profileImage">
            <img src={ProfileDummyImage} alt='Profile Image' />
            </div>
            <div className="detailsBlock">
            <div className="fullnameRow">
                <input
                    type="text"
                    value={firstaname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Введіть ваше ім'я..."
                    required
                />    
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Введіть ваше прізвище..."
                    required
                />  
            </div>
            <div className="descriptionRow">
                <p>Опис?</p>
            </div>
            <div className="emailRow">
                <p>Пошта:</p>
                <span>Пошта</span>
            </div>
            </div>
        </div>
        </div>
    )
}

export default ProfileEdit
