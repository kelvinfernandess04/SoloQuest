import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Link } from 'expo-router';

export default function Create() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');

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