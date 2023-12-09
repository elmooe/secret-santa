import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, push, onValue, set } from 'firebase/database';

function App() {
  const [name, setName] = useState('');
  const [pairs, setPairs] = useState({});
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    const pairsRef = ref(database, 'secretSantaPairs');
    onValue(pairsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPairs(data);
    });
  }, []);

  const handleDraw = () => {
    const lowerCaseName = name.toLowerCase();
  
    // Tarkista, onko käyttäjälle jo arvottu pari
    const existingPair = Object.entries(pairs).find(([key, value]) => value.giver.toLowerCase() === lowerCaseName);
    if (existingPair) {
      setSelectedName(existingPair[1].receiver);
      return;
    }
  
    const receiversAlreadyPaired = new Set(Object.values(pairs).map(pair => pair.receiver.toLowerCase()));
  
    const giversRef = ref(database, 'givers');
    const receiversRef = ref(database, 'receivers');
  
    onValue(giversRef, (snapshot) => {
      const giversList = snapshot.val() ? Object.values(snapshot.val()) : [];
  
      onValue(receiversRef, (snapshot) => {
        const receiversList = snapshot.val() ? Object.values(snapshot.val()) : [];
  
        if (giversList.includes(lowerCaseName) && receiversList.length > 1) {
          let filteredReceivers = receiversList
            .filter(n => n.toLowerCase() !== lowerCaseName)
            .filter(n => !receiversAlreadyPaired.has(n.toLowerCase()));
  
          if (filteredReceivers.length === 0) {
            alert("Ei enää saatavilla vastaanottajia.");
            return;
          }
  
          let randomIndex = Math.floor(Math.random() * filteredReceivers.length);
          const receiver = filteredReceivers[randomIndex];
          setSelectedName(receiver);
          savePair(lowerCaseName, receiver);
        } else {
          alert("Nimet loppu :-) Happy lahjanosto for U");
        }
      });
    });
  };
  

  const savePair = (giver, receiver) => {
    push(ref(database, 'secretSantaPairs'), {
      giver: giver.toLowerCase(),
      receiver: receiver
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Secret Santa🎅</h1>
        <input 
          type="text" 
          placeholder="Syötä etunimesi..." 
          value={name} 
          onChange={(e) => setName(e.target.value.toLowerCase())} 
        />
        <button onClick={handleDraw}>Arvo lahjansaaja</button>
        {selectedName && <p>Annat lahjan henkilölle: {selectedName}</p>}
      </header>
    </div>
  );
}

export default App;
