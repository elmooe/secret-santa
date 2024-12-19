import React, { useState, useRef, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from './firebase';

const NameRoller = ({
    selectedName,
    givers,
    className = '',
    onSpinComplete,
}) => {
  const [rollingNames, setRollingNames] = useState(givers);
  const [isRolling, setIsRolling] = useState(false);
  const wheelRef = useRef(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setRollingNames(givers);
  }, [givers]);

  const fetchWishlist = async () => {
    if (!selectedName) return;
    try {
      const userRef = ref(database, `users/${selectedName.toLowerCase()}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setWishlist(data.wishlist || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!showWishlist) {
      await fetchWishlist();
    }
    setShowWishlist((prev) => !prev);
  };

  const handleRoll = () => {
    if (isRolling || !selectedName) return;

    setIsRolling(true);

    const extendedNames = [
      ...rollingNames, 
      ...rollingNames, 
      ...rollingNames, 
      selectedName
    ];
    setRollingNames(extendedNames);

    // Animate the wheel
    if (wheelRef.current) {
      const nameHeight = wheelRef.current.children[0].clientHeight;
      const totalNames = rollingNames.length;
      const finalIndex = rollingNames.indexOf(selectedName);

      // Calculate the precise stopping point
      const finalPosition = (totalNames * 2 + finalIndex) * nameHeight;

      // Create a more controlled rolling animation
      wheelRef.current.style.transition = `transform 4s cubic-bezier(0.25, 0.75, 0.5, 1)`;
      wheelRef.current.style.transform = `translateY(-${finalPosition}px)`;

      // Reset and show final name
      setTimeout(() => {
        setIsRolling(false);
        
        // Instantly move to the final name's position
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `translateY(-${(totalNames * 2 + finalIndex) * nameHeight}px)`;
        if (onSpinComplete) {
            onSpinComplete();
          }
      }, 4000);
    }
  };

  const styles = {
    container: {
      maxWidth: '380px',
      width: '100%',
      margin: '0 auto'
    },
    display: {
      position: 'relative',
      backgroundColor: '#113770',
      padding: '1rem',
      borderRadius: '0.5rem',
      height: '9rem',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
    },
    wheel: {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      color: 'white',
      fontSize: '2.25rem',
      fontWeight: 'bold',
      letterSpacing: 'wider'
    },
    wheelItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '9rem'
    },
    pointer: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      color: '#ef4444'
    },
    wishlist: {
        backgroundColor: '#2d2d2d',
        color: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginTop: '1rem',
    },
  };

  return (
    <div style={styles.container} className={className}>
      <div style={styles.display}>
        <div 
          ref={wheelRef}
          style={{
            ...styles.wheel,
            transform: 'translateY(0px)',
            transition: 'transform 0.3s ease'
          }}
        >
          {rollingNames.length > 0 ? (
            rollingNames.map((name, index) => (
              <div 
                key={index} 
                style={styles.wheelItem}
              >
                {name}
              </div>
            ))
          ) : (
            <div style={styles.wheelItem}>No names available</div>
          )}
        </div>
      </div>
      <button 
        onClick={handleRoll} 
        disabled={isRolling || !selectedName}>
        {isRolling ? 'Arvotaan...' : 'Paina arpoaksesi n. 50€ lahja'}
      </button>
      {showWishlist && (
        <div style={styles.wishlist}>
          <h3>{selectedName}'s Wishlist</h3>
          {wishlist.length > 0 ? (
            <ul>
              {wishlist.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Ei toiveita.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NameRoller;