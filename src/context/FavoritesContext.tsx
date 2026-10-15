import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<{ success: boolean; isFav: boolean; needAuth?: boolean }>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: async () => ({ success: false, isFav: false }),
  favoritesCount: 0,
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    if (user?.phone) {
      unsub = firestoreService.subscribeUserFavorites(user.phone, (favs) => {
        setFavorites(favs);
      });
    } else {
      // Load guest/local favorites
      AsyncStorage.getItem('jeely_favorites_guest').then((str) => {
        if (str) setFavorites(JSON.parse(str));
        else setFavorites([]);
      });
    }

    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = async (id: string) => {
    let updated: string[];
    const currentlyFav = favorites.includes(id);
    if (currentlyFav) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }

    setFavorites(updated);

    if (user?.phone) {
      await firestoreService.saveUserFavorites(user.phone, updated);
      return { success: true, isFav: !currentlyFav };
    } else {
      await AsyncStorage.setItem('jeely_favorites_guest', JSON.stringify(updated));
      return { success: true, isFav: !currentlyFav };
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
