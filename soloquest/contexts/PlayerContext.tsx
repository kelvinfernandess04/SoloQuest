import React, { createContext, useContext, useState, ReactNode } from 'react';

type AttributeKey = 'STR' | 'AGI' | 'VIT' | 'INT' | 'PER' | 'DEX';

type PlayerAttribute = {
  [key in AttributeKey]: number;
};

interface PlayerData {
  attributes: PlayerAttribute;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  unspentPoints: number;
  gainXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  assignAttributePoint: (key: AttributeKey) => boolean;
}

const defaultAttributes: PlayerAttribute = {
  STR: 1,
  AGI: 1,
  VIT: 1,
  INT: 1,
  PER: 1,
  DEX: 1,
};

const PlayerContext = createContext<PlayerData | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [attributes, setAttributes] = useState<PlayerAttribute>(defaultAttributes);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [coins, setCoins] = useState(0);
  const [unspentPoints, setUnspentPoints] = useState(0);

  const gainXP = (amount: number) => {
    let newXP = xp + amount;
    let newLevel = level;
    let requiredXP = xpToNextLevel;
    let levelsGained = 0;

    while (newXP >= requiredXP) {
      newXP -= requiredXP;
      newLevel += 1;
      levelsGained += 1;
      requiredXP = Math.floor(requiredXP * 1.25);
    }

    setXP(newXP);
    setLevel(newLevel);
    setXpToNextLevel(requiredXP);
    if (levelsGained > 0) {
      setUnspentPoints(prev => prev + levelsGained);
    }
  };

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const spendCoins = (amount: number) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const assignAttributePoint = (key: AttributeKey) => {
    if (unspentPoints <= 0) return false;
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key] + 1
    }));
    setUnspentPoints(prev => prev - 1);
    return true;
  };

  return (
    <PlayerContext.Provider
      value={{
        attributes,
        level,
        xp,
        xpToNextLevel,
        coins,
        unspentPoints,
        gainXP,
        addCoins,
        spendCoins,
        assignAttributePoint,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
