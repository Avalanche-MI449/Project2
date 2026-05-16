import { useState } from 'react'
import './App.css'
import SetlistApiComponent from './setlistAPI'
import MusicPreviewWidget from "./MusicPreviewWidget";
import Events from './Events.jsx'
import Navbar from './Navbar.jsx'

// Franz Ferdinand

function App() {
  const [artist, setArtist] = useState("")
  const [inputArtist, setInputArtist] = useState("")
  const [selectedArtist, setSelectedArtist] = useState("")

  // Handler for the input box
  const getUserInputtedArtist = (event) => {
    setInputArtist(event.target.value)
  }

  // Handler for the button click
  const clickButton = () => {
    setArtist(inputArtist)
    setSelectedArtist("")
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-grid">
        <div className="left-column">
          <section className="widget-section search-section">
            <h1>Artist Search</h1>
            <h3 className="search-desc">Enter an artist's name to see their events and setlists and listen to a preview of their music.</h3>
            <div className="search-controls-vertical">
              <input id="artist_input" name="artist_input" type="text" onChange={ getUserInputtedArtist } />
              <button onClick={ clickButton }>Search</button>
            </div>
          </section>
          <section className="music-widget-container">
            <MusicPreviewWidget artistName={selectedArtist || artist} />
          </section>
        </div>
        <div className="right-column">
          <section className="widget-section widget-scrollable">
            <SetlistApiComponent artistName={artist} onArtistSelect={setSelectedArtist} />
          </section>
          <section className="widget-section widget-scrollable">
            <Events artistName={artist} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
