import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Link, router, useNavigation } from 'expo-router';
import * as dbQuestService from '../services/dbQuestService';
import { CreateStyles } from '../styles/CreateStyles';

export default function Create() {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDetails, setTaskDetails] = useState('');
    const navigation = useNavigation();
    const [taskPoints, setTaskPoints] = useState(0);

    useEffect(() => {
        const initializeDB = async () => {
            try {
                await dbQuestService.createTable();
            } catch (e) {
                console.log('Erro ao criar tabela:', e);
                Alert.alert('Erro', 'Falha ao inicializar o banco de dados');
            }
        };
        initializeDB();
    }, []);

    const createUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).slice(0, 2);
    };

    const handleCreateQuest = async () => {
        if (!taskTitle.trim() || !taskDetails.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos antes de salvar!');
            return;
        }

        const newQuest = {
            id: createUniqueId(),
            name: taskTitle,
            description: taskDetails,
            points: taskPoints
        };

        try {
            const success = await dbQuestService.createQuest(newQuest);

            if (success) {
                Alert.alert('Sucesso', 'Missão criada com sucesso!', [{
                    text: 'OK',
                    onPress: () => {
                        router.push('/')
                    }
                }]);
                setTaskTitle('');
                setTaskDetails('');
                Keyboard.dismiss();
            } else {
                Alert.alert('Erro', 'Não foi possível salvar a missão');
            }
        } catch (error) {
            console.error('Erro ao criar missão:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar salvar a missão');
        }
    };

    return (
        <View style={[GlobalStyle.container, { paddingTop: 24 }]}>
            <Text style={GlobalStyle.titulo}>Nova Missão</Text>

            <TextInput
                style={CreateStyles.input}
                placeholder="Nome da Missão"
                placeholderTextColor="#4E54C8"
                value={taskTitle}
                onChangeText={setTaskTitle}
                maxLength={50}
            />

            <TextInput
                style={[CreateStyles.input, {
                    height: 120,
                    textAlignVertical: 'top',
                    fontFamily: 'Exo2-Italic'
                }]}
                placeholder="Detalhes da Missão..."
                placeholderTextColor="#4E54C8"
                multiline
                value={taskDetails}
                onChangeText={setTaskDetails}
                maxLength={500}
            />

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginVertical: 12
            }}>
                {/* Botão Muito Fácil */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#4E54C8',
                        minWidth: 100
                    }}
                    onPress={() => { setTaskPoints(50) }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Muito Fácil</Text>
                </TouchableOpacity>

                {/* Botão Fácil */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#4E54C8'
                    }}
                    onPress={() => { setTaskPoints(100) }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Fácil</Text>
                </TouchableOpacity>

                {/* Botão Médio */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#4E54C8'
                    }}
                    onPress={() => { setTaskPoints(500) }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Médio</Text>
                </TouchableOpacity>

                {/* Botão Difícil */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#4E54C8'
                    }}
                    onPress={() => { setTaskPoints(1000) }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Difícil</Text>
                </TouchableOpacity>

                {/* Botão Muito Difícil */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#4E54C8'
                    }}
                    onPress={() => { setTaskPoints(2000) }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Muito Difícil</Text>
                </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
                <Link href="../" asChild>
                    <TouchableOpacity style={CreateStyles.botaoAdicionar}>
                        <Text style={{ color: '#E0E5FF' }}>Cancelar</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity
                    style={[CreateStyles.botaoAdicionar, { backgroundColor: '#7C83FD' }]}
                    onPress={handleCreateQuest}
                >
                    <Text style={{ color: '#0A0F24', fontWeight: 'bold' }}>Criar Missão</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}