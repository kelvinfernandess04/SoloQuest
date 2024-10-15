package br.edu.cefsa.SoloQuest.service;

import br.edu.cefsa.SoloQuest.model.Usuario;

public class UsuarioService {
    public void aumentarAtributo(Usuario usuario, String atributo, int pontos) {
        usuario.ganharAtributo(atributo, pontos);
    }

    public void verificarProgresso(Usuario usuario) {
        // Implementar lógica para verificar o progresso do usuário
    }
}
