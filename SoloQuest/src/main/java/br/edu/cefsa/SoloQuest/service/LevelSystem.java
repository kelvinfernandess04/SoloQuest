package br.edu.cefsa.SoloQuest.service;

import br.edu.cefsa.SoloQuest.model.Usuario;

public class LevelSystem {

    // Método para calcular o nível do usuário com base nos atributos
    public int calcularNivel(Usuario usuario) {
        int somaAtributos = usuario.getForca() + usuario.getInteligencia() +
                            usuario.getVitalidade() + usuario.getAgilidade() +
                            usuario.getPercepcao();
        return somaAtributos / 10; // Exemplo: Nível cresce conforme a soma de todos os atributos
    }

    // Método para desbloquear habilidades conforme o nível
    public void desbloquearHabilidade(Usuario usuario) {
        if (usuario.getNivel() >= 10) {
            // Exemplo: Desbloqueia uma habilidade especial
        }
    }
}
