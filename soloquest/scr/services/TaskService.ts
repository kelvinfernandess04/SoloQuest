import { Task } from "../models/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "tasks";

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    try {
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch (error) {
      console.error("Erro ao obter tarefas:", error);
      return [];
    }
  }

  static async addTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      tasks.push(task);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  }

  static async updateTask(updatedTask: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }
}
