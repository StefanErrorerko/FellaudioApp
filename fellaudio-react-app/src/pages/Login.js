import React from 'react'

import '../styles/Login.css'

function Contact() {
  return (
    <div className='contact'>
      <div className='rightSide'>
        <h1>Contact us</h1>
        <form id = "contact-form" method='POST'>
            <label htmlFor='name'>Full Name</label>
            <input name='name' placeholder='Enter the full name...' type='text' />

            <label htmlFor='email'>Email</label>
            <input name='email' placeholder='Enter the email...' type='text' />

            <label>Message</label>
            <textarea rows='6' placeholder='Enter the message...' name='message' required></textarea>

            <button type='submit'>Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact