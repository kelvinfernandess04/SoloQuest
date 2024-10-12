package br.edu.cefsa.SoloQuest.controller;

import br.edu.cefsa.SoloQuest.model.Missao;
import br.edu.cefsa.SoloQuest.model.MissaoDiaria;
import br.edu.cefsa.SoloQuest.model.MissaoSecundaria;

public class MissaoController {
    // Métodos para criar missões
    public Missao criarMissao(String descricao, String atributo, int recompensa) {
        return new Missao(); // Exemplo: retornar uma nova missão
    }

    public MissaoDiaria criarMissaoDiaria(String descricao, String atributo, int recompensa) {
        return new MissaoDiaria(); // Exemplo: retornar uma nova missão diária
    }

    public MissaoSecundaria criarMissaoSecundaria(String descricao, String atributo, int recompensa, int prazoDias) {
        return new MissaoSecundaria(); // Exemplo: retornar uma nova missão secundária
    }

    // Métodos para completar missões
    public void completarMissao(Missao missao) {
        missao.completarMissao();
    }
}
