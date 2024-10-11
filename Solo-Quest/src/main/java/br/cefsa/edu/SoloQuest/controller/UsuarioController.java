package br.cefsa.edu.SoloQuest.controller;

import br.cefsa.edu.SoloQuest.model.Usuario;

public class UsuarioController {
    private Usuario usuario;

    // Métodos para manipular os dados do usuário
    public void aumentarAtributo(String atributo, int pontos) {
        usuario.ganharAtributo(atributo, pontos);
    }

    public void visualizarProgresso() {
        // Implementar lógica para visualizar o progresso do usuário
    }
}
