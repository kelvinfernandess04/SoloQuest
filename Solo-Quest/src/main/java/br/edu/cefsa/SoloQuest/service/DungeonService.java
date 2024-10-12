package br.edu.cefsa.SoloQuest.service;

import br.edu.cefsa.SoloQuest.model.Dungeon;

public class DungeonService {
    public void iniciarDungeon(Dungeon dungeon) {
        dungeon.iniciarDungeon();
    }

    // Lógica para derrotar inimigos
    public boolean derrotarInimigo(Dungeon dungeon) {
        // Implementar lógica para derrotar inimigos na dungeon
        return false; // Exemplo: alterar conforme a lógica
    }
}
