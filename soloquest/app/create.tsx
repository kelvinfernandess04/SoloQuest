import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Link } from 'expo-router';
import * as DbService from '../services/dbservice';

export default function Create() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [quests, setQuests] = useState([])

  async function processamentoUseEffect() {
    try {
      await DbService.createTable();
      await carregaDados();
    }
    catch (e) {
      console.log(e);
    }
  }


  useEffect(
  () => {
    processamentoUseEffect(); //necessário método pois aqui não pode utilizar await...
  }, []);


  async function carregaDados() {
    try {
      console.log('carregando');
      let Quests = await DbService.readQuest();
      setQuests(Quests);
    } catch (e) {
      Alert.alert("erro");
    }
  }











  return (
    <View style={[GlobalStyle.container, { paddingTop: 24 }]}>
      <Text style={GlobalStyle.titulo}>Nova Missão</Text>

      <TextInput
        style={GlobalStyle.input}
        placeholder="Nome da Missão"
        placeholderTextColor="#4E54C8"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <TextInput
        style={[GlobalStyle.input, {
          height: 120,
          textAlignVertical: 'top',
          fontFamily: 'Exo2-Italic'
        }]}
        placeholder="Detalhes da Missão..."
        placeholderTextColor="#4E54C8"
        multiline
        value={taskDetails}
        onChangeText={setTaskDetails}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
        <Link href="../" asChild>
          <TouchableOpacity style={GlobalStyle.botaoAdicionar}>
            <Text style={{ color: '#E0E5FF' }}>Cancelar</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={[GlobalStyle.botaoAdicionar, { backgroundColor: '#7C83FD' }]}
          
        >
          <Text style={{ color: '#0A0F24', fontWeight: 'bold' }}>Criar Missão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function carregaDados() {
  throw new Error('Function not implemented.');
}


function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}
