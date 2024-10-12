package br.edu.cefsa.SoloQuest.controller;

import br.edu.cefsa.SoloQuest.model.Loja;
import br.edu.cefsa.SoloQuest.model.Equipamento;
import br.edu.cefsa.SoloQuest.model.Usuario;

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
