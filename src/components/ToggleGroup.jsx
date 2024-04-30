import React, { useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

function ToggleButtonGroup(props) {
  const [checked, setChecked] = useState('1')

  const handleRadioChange = (value) => {
    setChecked(value)
    props.onGenreChange(value)
  }

  const radios = [
    { name: 'All', value: '1' },
    { name: 'Fantasy', value: '2' },
    { name: 'Romance', value: '3' },
    { name: 'History', value: '4' },
    { name: 'Sci-fi', value: '5' },
    { name: 'Horror', value: '6' },
  ]

  return (
    <ButtonGroup>
      {radios.map((radio, idx) => (
        <ToggleButton
          key={idx}
          id={`radio-${idx}`}
          type="radio"
          variant={'light'}
          className="light-toggle-btn"
          name="radio"
          value={radio.value}
          onChange={() => handleRadioChange(radio.value)}
          checked={checked === radio.value}
        >
          {radio.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  )
}

export default ToggleButtonGroup
