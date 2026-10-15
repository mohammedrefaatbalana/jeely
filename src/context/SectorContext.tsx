import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sector } from '../types';

interface SectorContextType {
  sector: Sector | 'all';
  setSector: (sector: Sector | 'all') => void;
  showWelcomeModal: boolean;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  selectGateway: (chosen: Sector) => void;
}

const SectorContext = createContext<SectorContextType>({
  sector: 'crafts',
  setSector: () => {},
  showWelcomeModal: false,
  openWelcomeModal: () => {},
  closeWelcomeModal: () => {},
  selectGateway: () => {},
});

export const SectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sector, setSectorState] = useState<Sector | 'all'>('crafts');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    checkInitialSector();
  }, []);

  const checkInitialSector = async () => {
    try {
      const savedSector = await AsyncStorage.getItem('jeely_selected_sector');
      const hasChosen = await AsyncStorage.getItem('jeely_session_chosen');
      if (savedSector) {
        setSectorState(savedSector as Sector);
      }
      if (!hasChosen) {
        setShowWelcomeModal(true);
      }
    } catch {
      // Ignored
    }
  };

  const setSector = (newSector: Sector | 'all') => {
    setSectorState(newSector);
    AsyncStorage.setItem('jeely_selected_sector', newSector);
  };

  const selectGateway = (chosen: Sector) => {
    setSectorState(chosen);
    setShowWelcomeModal(false);
    AsyncStorage.setItem('jeely_selected_sector', chosen);
    AsyncStorage.setItem('jeely_session_chosen', 'true');
  };

  const openWelcomeModal = () => setShowWelcomeModal(true);
  const closeWelcomeModal = () => setShowWelcomeModal(false);

  return (
    <SectorContext.Provider
      value={{
        sector,
        setSector,
        showWelcomeModal,
        openWelcomeModal,
        closeWelcomeModal,
        selectGateway,
      }}
    >
      {children}
    </SectorContext.Provider>
  );
};

export const useSector = () => useContext(SectorContext);
