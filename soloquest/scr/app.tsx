// src/App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GameProvider } from "./contexts/GameContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GameProvider>
  );
}
