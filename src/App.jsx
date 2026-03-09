import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SetlistApiComponent from './setlistAPI'

// Franz Ferdinand

function App() {
  const [artist, setArtist] = useState("")
  const [inputArtist, setInputArtist] = useState("")

  // Handler for the input box
  const getUserInputtedArtist = (event) => {
    setInputArtist(event.target.value)
  }

  // Handler for the button click
  const clickButton = () => {
    setArtist(inputArtist)
  }

  return (
    <>
      <p>franz ferdinand</p>
      <p>aa7a2827-f74b-473c-bd79-03d065835cf7</p>
      <input id="artist_input" name="artist_input" type="text" onChange={ getUserInputtedArtist }/>
      <button onClick={ clickButton }>Click Me</button>

      <SetlistApiComponent artistName={artist} />
      {/* <SetlistComponent artistName="The Beatles" /> */}
    </>
  )
}

export default App
