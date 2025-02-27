import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LoginStyle } from '../styles/LoginStyles';
import { GlobalStyle } from '../styles/GlobalStyles';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    alert(`Usuário: ${usuario}, Senha: ${senha}`);
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.titulo}>Solo Quest</Text>

      <TextInput
        style={LoginStyle.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={LoginStyle.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={LoginStyle.botao} onPress={handleLogin}>
        <Text style={LoginStyle.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;