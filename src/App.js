import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, push, onValue, set, get, child } from 'firebase/database';
import NameRoller from './NameRoller';
import CelebrationNote from './CelebrationNote';
import WishlistForUser from './WishlistForUser';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [givers, setGivers] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // uusi käyttäjä
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');



  useEffect(() => {
    if (isLoggedIn) {
      const giversRef = ref(database, 'givers');
      const pairsRef = ref(database, 'secretSantaPairs');
  
      const handleGivers = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGivers(Object.values(data));
        }
      };
  
      const handlePairs = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pair = Object.values(data).find(pair => pair.giver === username.toLowerCase());
          if (pair) {
            setSelectedName(pair.receiver);
          }
        }
      };
  
      const unsubscribeGivers = onValue(giversRef, handleGivers, (error) => {
        console.error('Error fetching data:', error);
      });
  
      const unsubscribePairs = onValue(pairsRef, handlePairs, (error) => {
        console.error('Error fetching data:', error);
      });

      return () => {
        unsubscribeGivers();
        unsubscribePairs();
      };
    }
  }, [isLoggedIn, username]);

  const handleLogin = () => {
    const usersRef = ref(database, 'users');
    get(child(usersRef, username.toLowerCase()))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.password === password) {
            setIsLoggedIn(true);
          } else {
            alert('Väärä salasana');
          }
        } else {
          alert('Käyttäjää ei löydy');
        }
      })
      .catch((error) => {
        console.error('Virhe haettaessa käyttäjää:', error);
        alert('Virhe kirjautumisessa.');
      });
  };
  
  console.log(givers);

  const handleCreateUser = () => {
    if (!newUsername || !newPassword) {
      alert('Syötä sekä nimi että salasana');
      return;
    }
  
    const usersRef = ref(database, `users/${newUsername.toLowerCase()}`);
    const giversRef = ref(database, `givers/${newUsername.toLowerCase()}`);
  
    set(usersRef, { password: newPassword })
      .then(() => {
        set(giversRef, newUsername.toLowerCase())
          .then(() => {
            alert('Käyttäjä luotu onnistuneesti!');
            setNewUsername('');
            setNewPassword('');
            setIsCreatingUser(false);
          })
          .catch((error) => {
            console.error('Virhe givers-listalle tallennuksessa:', error);
            alert('Virhe luotaessa käyttäjää.');
          });
      })
      .catch((error) => {
        console.error('Virhe käyttäjän tallennuksessa:', error);
        alert('Virhe luotaessa käyttäjää.');
      });
  };

  const generateSecretSantaPairs = () => {
    if (givers.length === 0) {
      alert('Ei osallistujia arvottavaksi.');
      return;
    }

    const shuffled = [...givers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 100) {
      isValid = true;
      attempts++;

      for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] === givers[i]) {
          isValid = false;
          shuffled.push(shuffled.splice(i, 1)[0]);
          break;
        }
      }
    }

    if (!isValid) {
      alert('Parien luominen epäonnistui. Yritä uudelleen.');
      return;
    }

    const pairsRef = ref(database, 'secretSantaPairs');
    const pairs = givers.map((giver, index) => ({
      giver,
      receiver: shuffled[index],
    }));

    set(pairsRef, pairs)
      .then(() => {
        alert('Secret Santa -parit arvottu onnistuneesti!');
      })
      .catch((error) => {
        console.error('Error saving pairs:', error);
        alert('Virhe tallentaessa pareja.');
      });
  };

  const handleSpinComplete = () => {
    setShowCelebration(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Secret Santa🎅</h1>
        {!isLoggedIn && !isCreatingUser ? (
          <div className="Inputs">

            <a className='ilmoitus'>Kirjaudu sisään ja luo toivelista itsellesi!</a>
            
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

            <div className="href">
              <a href='#' onClick={() => setIsCreatingUser(true)}>Luo käyttäjä</a>
            </div>

          </div>
        ) : isCreatingUser ? (
          <div className="Inputs">
            <h2>Luo uusi käyttäjä</h2>
            <input
              type="text"
              placeholder="Uusi etunimi"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Uusi salasana"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleCreateUser}>Tallenna</button>
            <a href='#' onClick={() => setIsCreatingUser(false)}>Takaisin</a>
          </div>
        ) : (
          <>
          
          <WishlistForUser username={username.toLowerCase()} />
          <a style={{padding: '20px'}}>Note: <br></br>
            Kunhan jokainen osallistuja on tehnyt toivelistan, arvotaan parit :-)</a>
        
          {/*
          <button onClick={generateSecretSantaPairs}>Arvo Secret Santa -parit</button>
        
          <NameRoller
            selectedName={selectedName}
            givers={givers}
            onSpinComplete={handleSpinComplete}
          />
          {showCelebration && <CelebrationNote selectedName={selectedName} username={username} />}
          */}

          </>
        )}
      </header>
    </div>
  );
}

export default App;
