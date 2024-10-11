package br.cefsa.edu.SoloQuest.model;

import java.time.LocalDate;

public class Missao {
    private Long id;
    private String descricao;
    private LocalDate dataCriacao;
    private boolean concluida;

    // Atributo influenciado pela missão (STR, INT, VIT, AGI, PER)
    private String atributo;
    private int recompensa;

    // Método para completar a missão
    public void completarMissao() {
        this.concluida = true;
    }
}
