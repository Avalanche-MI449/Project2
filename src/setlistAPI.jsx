import React, {useState, useEffect} from 'react';
import axios from 'axios';

// const setlistURL = '/api/1.0/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';
const setlistApiKey = '1c1QlARHxXsUKzGmRT1Tnp3YoDZwTt4R22To';

const SetlistApiComponent = ({ artistName }) => {
    // This will hold the values for setlisst, which we will get from the API 
    const [artists, setArtists] = useState([]);
    const [artistMBID, setArtistMBID] = useState("");
    const [setlists, setSetlists] = useState([]);
    const [sets, setSets] = useState([]);
    const [setlistDate, setSetlistDate] = useState("");
    const [songs, setSongs] = useState([]);

    const artistMBIDMap = {};



    // Get the artist data from the API based off the artist name
    useEffect(() => {
        // Create a function to fetch the data from the API
        const fetchArtistData = async () => {
            try{
                // Check to make sure we have an artist name before we try to fetch data
                if (!artistName) {
                    return;
                }

                const setlistURL = `/setlistapi/1.0/search/artists?artistName=${artistName}&p=1&sort=sortName`;

                // Connect to the API 
                const response = await axios.get(
                    setlistURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                // Set our variables to the data we get back from the API
                setArtists(response.data.artist);
                setSetlists([]);

            } catch(error) {
                console.error('Error fetching setlist data:', error);
            };
        };

        fetchArtistData();
    }, [artistName]);


    // Get setlist data from the API based off the artist MBID
    useEffect(() => {
        const fetchSetlistData = async () => {
            try {
                if (!artistMBID) {
                    return;
                }

                const setlistURL = `/setlistapi/1.0/artist/${artistMBID}/setlists?p=1`;

                const response = await axios.get(
                    setlistURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                setSetlists(response.data.setlist);
                songList = [];

            } catch (error) {
                console.error('Error fetching setlist data:', error);
            }
        };

        fetchSetlistData();
    }, [artistMBID]);

    // Store the MBID for each artist
    for (let i = 0; i < artists.length; i++) {
        artistMBIDMap[artists[i].name] = artists[i].mbid;
    }

    // Store the songs from each setlist after reading the data from the API 
    const storeSongs = () => {
        let allSets = sets[0]['sets']['set'];

        for (let set of allSets) {
            for (let song of set['song']) {
                // songList.push(song['name']);
                setSongs(prevItems => [...prevItems, song['name']]);
            }
        }

    }

    // Get the songs from a setlist from the API
    useEffect(() => {
        const fetchSongsData = async () => {
            try {
                const songURL = `/setlistapi/1.0/search/setlists?artistMbid=aa7a2827-f74b-473c-bd79-03d065835cf7&date=09-12-2025&p=1`;
                
                const response = await axios.get(
                    songURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                setSets(response.data.setlist);
                storeSongs();

            } catch (error) {
                console.error('Error fetching songs data:', error);
            }
        };

        fetchSongsData();
    }, [setlistDate]);



    // ================================================================================
    // Display the data from the API 
    // Flow: Artist -> Setlist -> Songs
    // ================================================================================
    
    // Only render the setlist data if we have an artist name, otherwise prompt the user to enter one
    if (!artistName) {
        return <p>Please enter an artist name to see the setlist data.</p>;
    }

    // Display the possible artists the user can pick 
    if (artists.length > 0 && setlists.length === 0) {
        return (
            <div>
                <p>Possible Artists: </p>
                <ul>
                    {artists.map(artist => (
                        <li key={artist.name}>
                            <button onClick={() => { setArtistMBID(artistMBIDMap[artist.name]) }}>{artist.name}</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Display the possible setlists from the artist the user picked
    if (setlists.length > 0 && songs.length === 0) {
        return (
            <div>
                <h3>Possbile Setlists:</h3>
                <ul>
                    {setlists.map(setlist => (
                        <li key={setlist.id}>
                            <button onClick={ () => setSetlistDate(setlist.eventDate) }><p>{setlist.eventDate}</p></button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }



    if (songs.length > 0) {
        return (
            <div>
                <h3>Setlist for {artistName} on {setlistDate}:</h3>
                <ul>
                    {songs.map((song, index) => (
                        <li key={index}>{song}</li>
                    ))}
                </ul>
            </div>
        );
    }



    // Display the songs from the setlist the user picked


    // return (
    //     <div>
            
    //         <h2>Artist Name: {artistName}</h2>

            // <p>Possible Artists: </p>
            // <ul>
            //     {artists.map(artist => (
            //         <li key={artist.name}>
            //             <button onClick={() => { setArtistMBID(artistMBIDMap[artist.name])}}>{artist.name}</button>
            //         </li>
            //     ))}
            // </ul>

            // <h3>Possbile Setlists:</h3>
            // <ul>
            //     {setlists.map(setlist => (
            //         <li key={setlist.id}>
            //             <button><p>{setlist.eventDate}</p></button>
            //         </li>
            //     ))}
            // </ul>
    //     </div>
    // );




};

export default SetlistApiComponent;