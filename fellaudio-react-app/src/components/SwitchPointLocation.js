import React from 'react'
import Switch from 'react-switch';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Add from '@mui/icons-material/Add';

function SwitchPointLocation({isSwitchOn, handleSwitchChange}) {
  return (
    <div className="switchContainer">
          <label>
            <Switch 
              onChange={handleSwitchChange} 
              checked={isSwitchOn} 
              offColor="#d7cfbd"
              onColor="#d7cfbd"
              offHandleColor="#4F6F52"
              onHandleColor="#4F6F52"
              box-shadow='inset 0 2px 5px rgba(0, 0, 0, 0.3)'
              height={30} 
              width={60} 
              activeBoxShadow='0 0 2px 3px #aaaaaa'
              handleDiameter={25}
              
              uncheckedIcon={
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: 15,
                  color: '#4F6F52',
                  paddingRight: 2
                }}>
                  <EditLocationAltIcon />
                </div>
              }
              checkedIcon={
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: 15,
                  color: '#4F6F52',
                  paddingRight: 2
                }}>
                  <AddLocationAltIcon />
                </div>
              }
            />
          </label>
    </div>
  )
}

export default SwitchPointLocation
