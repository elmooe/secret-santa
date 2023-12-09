import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

function App() {
  const [username, setUsername] = useState(''); // käyttäjän syöttämä nimi
  const [password, setPassword] = useState(''); // käyttäjän syöttämä salasana
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const users = {
    'emmi': 'tätimoonika',
    'elmo': 'elmo123',
    'vesa': 'anselmi',
    'paula': 'polakki',
    'tommi': 'tomaatti',
    'annika': 'annika123',
    'laura': 'lauruski',
    'jaakko': 'jaskajokunen',
    'ghita': 'ghita234'
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Päivitetään tietokannan polku käyttäen käyttäjänimeä
      const pairsRef = ref(database, 'secretSantaPairs');
      onValue(pairsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Etsitään pari, jossa käyttäjä on antaja (giver)
          const pair = Object.values(data).find(pair => pair.giver === username.toLowerCase());
          if (pair) {
            setSelectedName(pair.receiver); // Päivitetään lahjansaajan nimi
          }
        }
      });
    }
  }, [isLoggedIn, username]);
  

  const handleLogin = () => {
    if (users[username.toLowerCase()] === password) {
      setIsLoggedIn(true);
    } else {
      alert('Väärä nimi tai salasana');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Secret Santa🎅</h1>
        {!isLoggedIn ? (
          <div>
            <input 
              type="text" 
              placeholder="Syötä etunimi" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Syötä salasana" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Kirjaudu</button>
          </div>
        ) : (
          <p>Annat lahjan henkilölle: {selectedName}</p>
        )}
      </header>
    </div>
  );
}

export default App;
