import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, set, onValue } from 'firebase/database';

const WishlistForUser = ({ username }) => {
  const [wishlist, setWishlistState] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [isVisible, setIsVisible] = useState(false); // Aluksi lista on piilossa

  useEffect(() => {
    if (username) {
      const wishlistRef = ref(database, `users/${username}/wishlist`);

      const unsubscribe = onValue(wishlistRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWishlistState(data);
        } else {
          setWishlistState([]);
        }
      });

      return () => unsubscribe();
    }
  }, [username]);

  const handleAddWish = () => {
    if (!newWish.trim()) {
      alert('Toive ei voi olla tyhjä');
      return;
    }

    const wishlistRef = ref(database, `users/${username}/wishlist`);
    const updatedWishlist = [...wishlist, newWish];

    set(wishlistRef, updatedWishlist)
      .then(() => {
        setNewWish('');
      })
      .catch((error) => {
        console.error('Virhe lisättäessä toivetta:', error);
        alert('Virhe toivetta lisätäessä.');
      });
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Vaihdetaan näkyvyyttä
  };

  return (
    <div className="WishlistForUser">
      <button
        onClick={toggleVisibility}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {isVisible ? 'Piilota toivelista' : 'Avaa toivelista'}
      </button>
      {isVisible && (
        <div className="Wishlist mt-4">
          <h2>Toiveesi</h2>
          <ul className="wishlist-container">
            {wishlist.map((wish, index) => (
                <li key={index} style={{
                                borderBottom: '1px solid #eee',
                                padding: '10px 0'
                            }}>
                    {wish}
                </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Kirjoita uusi toive"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleAddWish}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Lisää toive
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistForUser;