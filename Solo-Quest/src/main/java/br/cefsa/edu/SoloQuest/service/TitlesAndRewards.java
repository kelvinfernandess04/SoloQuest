package br.cefsa.edu.SoloQuest.service;

import br.cefsa.edu.SoloQuest.model.Usuario;

public class TitlesAndRewards {

    // Método para conceder título ao usuário
    public String concederTitulo(Usuario usuario) {
        if (usuario.getForca() >= 100) {
            return "Mestre da Força";
        } else if (usuario.getAgilidade() >= 100) {
            return "Guerreiro Ágil";
        }
        return "Aventureiro";
    }

    // Método para conferir recompensas
    public void concederRecompensa(Usuario usuario) {
        // Implementar lógica de recompensas por completar milestones
    }
}
