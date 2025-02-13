// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task } from "../models/Task";
import { Character } from "../models/Attribute";
import { Inventory } from "../models/Inventory";
import { Skill } from "../models/Skill";
import { Achievement } from "../models/Rank";
import { StorageService } from "../services/StorageService"; // Serviço de persistência

// Definição do tipo do contexto
interface GameContextType {
  tasks: Task[]; // Lista de tarefas
  character: Character; // Dados do personagem
  inventory: Inventory; // Inventário do jogador
  skills: Skill[]; // Habilidades desbloqueadas
  achievements: Achievement[]; // Conquistas do jogador

  addTask: (task: Task) => void; // Adicionar tarefa
  completeTask: (taskId: string) => void; // Marcar tarefa como concluída
  addItemToInventory: (itemId: string) => void; // Adicionar item ao inventário
  unlockSkill: (skillId: string) => void; // Desbloquear habilidade
  saveGameState: () => void; // Salvar estado do jogo no armazenamento local
}

// Criando o contexto do jogo
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provedor do contexto
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estados globais do jogo
  const [tasks, setTasks] = useState<Task[]>([]);
  const [character, setCharacter] = useState<Character>({ attributes: [], level: 1, experience: 0 });
  const [inventory, setInventory] = useState<Inventory>({ items: [], equipped: [] });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Carregar dados do armazenamento local ao iniciar
  useEffect(() => {
    const loadGameData = async () => {
      const savedTasks = await StorageService.loadData("tasks");
      const savedCharacter = await StorageService.loadData("character");
      const savedInventory = await StorageService.loadData("inventory");
      const savedSkills = await StorageService.loadData("skills");
      const savedAchievements = await StorageService.loadData("achievements");

      if (savedTasks) setTasks(savedTasks);
      if (savedCharacter) setCharacter(savedCharacter);
      if (savedInventory) setInventory(savedInventory);
      if (savedSkills) setSkills(savedSkills);
      if (savedAchievements) setAchievements(savedAchievements);
    };

    loadGameData();
  }, []);

  // Função para adicionar uma nova tarefa
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    saveGameState();
  };

  // Função para marcar uma tarefa como concluída
  const completeTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: true } : task))
    );
    saveGameState();
  };

  // Função para adicionar um item ao inventário
  const addItemToInventory = (itemId: string) => {
    setInventory((prevInventory) => ({
      ...prevInventory,
      items: [...prevInventory.items, { id: itemId, name: "Novo Item" }],
    }));
    saveGameState();
  };

  // Função para desbloquear uma habilidade
  const unlockSkill = (skillId: string) => {
    setSkills((prevSkills) => [
      ...prevSkills,
      { id: skillId, name: "Nova Habilidade", effect: "Buff", isUnlocked: true },
    ]);
    saveGameState();
  };

  // Função para salvar o estado do jogo no armazenamento local
  const saveGameState = async () => {
    await StorageService.saveData("tasks", tasks);
    await StorageService.saveData("character", character);
    await StorageService.saveData("inventory", inventory);
    await StorageService.saveData("skills", skills);
    await StorageService.saveData("achievements", achievements);
  };

  return (
    <GameContext.Provider
      value={{
        tasks,
        character,
        inventory,
        skills,
        achievements,
        addTask,
        completeTask,
        addItemToInventory,
        unlockSkill,
        saveGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook para consumir o contexto em componentes
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame deve ser usado dentro de um GameProvider");
  }
  return context;
};
