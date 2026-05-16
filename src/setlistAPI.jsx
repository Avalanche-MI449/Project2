import React, {useState, useEffect} from 'react';
import axios from 'axios';

// const setlistURL = '/api/1.0/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';
const setlistApiKey = import.meta.env.VITE_SETLIST_API_KEY;

const formatEventDate = (eventDate) => {
    if (!eventDate) {
        return "";
    }

    const [day, month, year] = eventDate.split('-');
    if (!day || !month || !year) {
        return eventDate;
    }

    return `${month}-${day}-${year}`;
};

const itemsPerPage = 8;

const SetlistApiComponent = ({ artistName, onArtistSelect }) => {
    // This will hold the values for setlisst, which we will get from the API 
    const [artists, setArtists] = useState([]);
    const [artistMBID, setArtistMBID] = useState("");
    const [selectedArtistLabel, setSelectedArtistLabel] = useState("");
    const [setlists, setSetlists] = useState([]);
    const [setlistDate, setSetlistDate] = useState("");
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(0);

    const currentItems = !artistMBID
        ? artists
        : !setlistDate
            ? setlists
            : songs;

    const totalPages = Math.max(1, Math.ceil(currentItems.length / itemsPerPage));
    const pageStart = page * itemsPerPage;
    const pageEnd = pageStart + itemsPerPage;
    const pagedItems = currentItems.slice(pageStart, pageEnd);

    const goPrevPage = () => {
        setPage((currentPage) => Math.max(0, currentPage - 1));
    };

    const goNextPage = () => {
        setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1));
    };



    // Get the artist data from the API based off the artist name
    useEffect(() => {
        // Create a function to fetch the data from the API
        const fetchArtistData = async () => {
            try{
                // Check to make sure we have an artist name before we try to fetch data
                if (!artistName) {
                    return;
                }

                const setlistURL = `/setlistapi/1.0/search/artists?artistName=${encodeURIComponent(artistName)}&p=1&sort=sortName`;

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
                setArtists(response.data.artist || []);
                setArtistMBID("");
                setSelectedArtistLabel("");
                setSetlists([]);
                setSetlistDate("");
                setSongs([]);
                setPage(0);

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

                const setlistURL = `/setlistapi/1.0/artist/${encodeURIComponent(artistMBID)}/setlists?p=1`;

                const response = await axios.get(
                    setlistURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                setSetlists(Array.isArray(response.data.setlist) ? response.data.setlist : []);
                setSetlistDate("");
                setSongs([]);
                setPage(0);

            } catch (error) {
                console.error('Error fetching setlist data:', error);
            }
        };

        fetchSetlistData();
    }, [artistMBID]);

    // Get the songs from a setlist from the API
    useEffect(() => {
        const fetchSongsData = async () => {
            try {
                if (!artistMBID || !setlistDate) {
                    return;
                }

                const songURL = `/setlistapi/1.0/search/setlists?artistMbid=${encodeURIComponent(artistMBID)}&date=${encodeURIComponent(setlistDate)}&p=1`;
                
                const response = await axios.get(
                    songURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                const foundSetlists = Array.isArray(response.data.setlist) ? response.data.setlist : [];
                const selectedSetlist = foundSetlists.find((setlist) => setlist.eventDate === setlistDate) || foundSetlists[0];
                const setsForDate = selectedSetlist?.sets?.set;
                const normalizedSets = Array.isArray(setsForDate) ? setsForDate : (setsForDate ? [setsForDate] : []);
                const extractedSongs = normalizedSets.flatMap((set) => {
                    const setSongs = set?.song;
                    const normalizedSongs = Array.isArray(setSongs) ? setSongs : (setSongs ? [setSongs] : []);
                    return normalizedSongs.map((song) => song?.name).filter(Boolean);
                });

                setSongs(extractedSongs);
                setPage(0);

            } catch (error) {
                console.error('Error fetching songs data:', error);
            }
        };

        fetchSongsData();
    }, [artistMBID, setlistDate]);



    // ================================================================================
    // Display the data from the API 
    // Flow: Artist -> Setlist -> Songs
    // ================================================================================
    
    // Only render the setlist data if we have an artist name, otherwise prompt the user to enter one
    if (!artistName) {
        return <h2>Please enter an artist name to see the setlist data.</h2>;
    }

    // Display the possible artists the user can pick 
    if (!artistMBID) {
        return (
            <div className="setlist-panel-body">
                <div className="panel-heading">
                    <h3 className="panel-title">Possible Setlists</h3>
                </div>
                <div className="button-grid">
                    {pagedItems.map(artist => (
                        <button
                            key={artist.mbid || artist.name}
                            onClick={() => {
                                if (!artist.mbid) {
                                    return;
                                }
                                setArtistMBID(artist.mbid);
                                setSelectedArtistLabel(artist.name || "");
                                setSetlistDate("");
                                setSongs([]);
                                setPage(0);
                                if (onArtistSelect) onArtistSelect(artist.name || "");
                            }}
                            disabled={!artist.mbid}
                        >
                            {artist.name}
                        </button>
                    ))}
                </div>
                {artists.length > itemsPerPage && (
                    <div className="pager-controls">
                        <button onClick={goPrevPage} disabled={page === 0}>Prev</button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button onClick={goNextPage} disabled={page >= totalPages - 1}>Next</button>
                    </div>
                )}
            </div>
        );
    }

    // Display the possible setlists from the artist the user picked
    if (!setlistDate) {
        return (
            <div className="setlist-panel-body">
                <div className="panel-heading">
                    <h3 className="panel-title">Possible Setlists{selectedArtistLabel ? ` for ${selectedArtistLabel}` : ""}</h3>
                </div>
                <button
                    onClick={() => {
                        setArtistMBID("");
                        setSelectedArtistLabel("");
                        setSetlists([]);
                        setSetlistDate("");
                        setSongs([]);
                        setPage(0);
                    }}
                >
                    Back to Artists
                </button>
                {setlists.length > 0 ? (
                    <div className="button-grid">
                        {pagedItems.map(setlist => (
                            <button key={setlist.id} onClick={ () => {
                                setSetlistDate(setlist.eventDate);
                                setPage(0);
                            }}>
                                {formatEventDate(setlist.eventDate)}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p>No setlists found for this artist.</p>
                )}
                {setlists.length > itemsPerPage && (
                    <div className="pager-controls">
                        <button onClick={goPrevPage} disabled={page === 0}>Prev</button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button onClick={goNextPage} disabled={page >= totalPages - 1}>Next</button>
                    </div>
                )}
            </div>
        );
    }

    if (setlistDate) {
        return (
            <div className="setlist-panel-body">
                <div className="panel-heading">
                    <h3 className="panel-title">Setlist for {selectedArtistLabel || artistName} on {formatEventDate(setlistDate)}</h3>
                </div>
                <button
                    onClick={() => {
                        setSetlistDate("");
                        setSongs([]);
                        setPage(0);
                    }}
                >
                    Back to Dates
                </button>
                <button
                    onClick={() => {
                        setArtistMBID("");
                        setSelectedArtistLabel("");
                        setSetlists([]);
                        setSetlistDate("");
                        setSongs([]);
                        setPage(0);
                    }}
                >
                    Back to Artists
                </button>
                {songs.length > 0 ? (
                    <div className="button-grid">
                        {pagedItems.map((song, index) => (
                            <button key={index}>{song}</button>
                        ))}
                    </div>
                ) : (
                    <p>Setlist not available at this time.</p>
                )}
                {songs.length > itemsPerPage && (
                    <div className="pager-controls">
                        <button onClick={goPrevPage} disabled={page === 0}>Prev</button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button onClick={goNextPage} disabled={page >= totalPages - 1}>Next</button>
                    </div>
                )}
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