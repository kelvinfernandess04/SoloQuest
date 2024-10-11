package br.cefsa.edu.SoloQuest.controller;

import br.cefsa.edu.SoloQuest.model.Loja;
import br.cefsa.edu.SoloQuest.model.Equipamento;
import br.cefsa.edu.SoloQuest.model.Usuario;

public class LojaController {
    private Loja loja;

    // Método para comprar equipamento
    public void comprarEquipamento(Usuario usuario, Equipamento equipamento) {
        loja.comprarEquipamento(usuario, equipamento);
    }

    // Método para vender equipamento
    public void venderEquipamento(Usuario usuario, Equipamento equipamento) {
        loja.venderEquipamento(usuario, equipamento);
    }
}
