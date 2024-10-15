package br.edu.cefsa.SoloQuest.model;

import java.util.List;

public class Usuario {
    private Long id;
    private String nome;
    private int nivel;
    private int gold;
    private int pontosDeVida;
    private int pontosDeMana;

    private int forca;
    private int inteligencia;
    private int vitalidade;
    private int agilidade;
    private int percepcao;

    // Histórico de progresso
    private List<HistoricoProgresso> historicoProgresso;

    // Métodos para ganho de atributos com base nas missões
    public void ganharAtributo(String atributo, int pontos) {
        // Implementar lógica para adicionar pontos ao atributo correspondente
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public int getNivel() {
        return nivel;
    }

    public int getGold() {
        return gold;
    }

    public int getPontosDeVida() {
        return pontosDeVida;
    }

    public int getPontosDeMana() {
        return pontosDeMana;
    }

    public int getForca() {
        return forca;
    }

    public int getInteligencia() {
        return inteligencia;
    }

    public int getVitalidade() {
        return vitalidade;
    }

    public int getAgilidade() {
        return agilidade;
    }

    public int getPercepcao() {
        return percepcao;
    }

    public List<HistoricoProgresso> getHistoricoProgresso() {
        return historicoProgresso;
    }
    
}
