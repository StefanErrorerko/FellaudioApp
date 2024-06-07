import React from 'react'
import '../styles/Components.css'
import {Create, Done} from '@mui/icons-material'

function FloatingEditButton({handleOnClick, isEditing}) {
  return (
    <div className='floatingEditArea'>
        <button onClick={() => {handleOnClick()}}>
            {isEditing ? (
                <Done />
            ) : (
                <Create />
            )}
        </button>      
    </div>

  )
}

export default FloatingEditButton
