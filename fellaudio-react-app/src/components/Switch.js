import React from 'react'
import Switch from 'react-switch';
import MapIcon from '@mui/icons-material/Map';
import GridViewIcon from '@mui/icons-material/GridView';

function MapSwitch({isSwitchOn, handleSwitchChange}) {
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
              height={40}  // Set height of the switch
              width={80}   // Set width of the switch
              activeBoxShadow='0 0 2px 3px #aaaaaa'
              
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
                  <MapIcon />
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
                  <GridViewIcon />
                </div>
              }
            />
          </label>
    </div>
  )
}

export default MapSwitch
