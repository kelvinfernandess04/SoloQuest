package br.cefsa.edu.SoloQuest.service;

import br.cefsa.edu.SoloQuest.model.Missao;

public class MissaoService {
    public void completarMissao(Missao missao) {
        missao.completarMissao();
    }

    // Lógica de penalidades e recompensas
    public void aplicarPenalidadeOuRecompensa(Missao missao) {
        // Implementar lógica para aplicar penalidade ou recompensa ao usuário
    }
}
