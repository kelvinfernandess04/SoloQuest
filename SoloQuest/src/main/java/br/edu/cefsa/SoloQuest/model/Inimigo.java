package br.edu.cefsa.SoloQuest.model;

public class Inimigo {
    private Long id;
    private String nome;
    private int dificuldade; // Facil, Medio, Dificil
    private String atributoNecessario; // STR, INT, etc.

    // Método para verificar se o inimigo pode ser derrotado
    public boolean podeSerDerrotado(Usuario usuario) {
        // Implementar lógica para verificar se o usuário tem atributos suficientes
        return false; // Exemplo: alterar conforme a lógica
    }
}
