package br.edu.cefsa.SoloQuest.model;

import java.util.List;

public class Loja {
    private Long id;
    private List<Equipamento> estoque;

    // Métodos para compra e venda de equipamentos
    public void comprarEquipamento(Usuario usuario, Equipamento equipamento) {
        // Implementar lógica de compra
    }

    public void venderEquipamento(Usuario usuario, Equipamento equipamento) {
        // Implementar lógica de venda
    }
}
