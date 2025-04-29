import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as dbQuestService from '../services/dbQuestService';
import { GlobalStyle } from '../styles/GlobalStyles';
import { CreateStyles } from '../styles/CreateStyles';

export default function EditQuest() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Obtém o ID da missão via parâmetros
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDetails, setTaskDetails] = useState('');
    const [taskPoints, setTaskPoints] = useState(0);

    useEffect(() => {
        const loadQuest = async () => {
            try {
                const quests = await dbQuestService.readQuest();
                const quest = quests.find(q => q.id === id);
                if (quest) {
                    setTaskTitle(quest.name);
                    setTaskDetails(quest.description);
                    setTaskPoints(quest.points);
                } else {
                    Alert.alert('Erro', 'Missão não encontrada.');
                    router.replace('/');
                }
            } catch (error) {
                console.error('Erro ao carregar missão:', error);
                Alert.alert('Erro', 'Falha ao carregar os detalhes da missão.');
            }
        };

        if (id) {
            loadQuest();
        }
    }, [id]);

    const handleUpdateQuest = async () => {
        if (!taskTitle.trim() || !taskDetails.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos antes de salvar!');
            return;
        }

        const updatedQuest = {
            id: id as string,
            name: taskTitle,
            description: taskDetails,
            points: taskPoints
        };

        try {
            const success = await dbQuestService.updateQuest(updatedQuest);

            if (success) {
                Alert.alert('Sucesso', 'Missão atualizada com sucesso!', [{
                    text: 'OK',
                    onPress: () => router.replace('/')
                }]);
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar a missão.');
            }
        } catch (error) {
            console.error('Erro ao atualizar missão:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar salvar a missão.');
        }
    };

    return (
        <View style={[GlobalStyle.container, { paddingTop: 24 }]}>
            <Text style={GlobalStyle.titulo}>Editar Missão</Text>

            <TextInput
                style={CreateStyles.input}
                placeholder="Nome da Missão"
                placeholderTextColor="#4E54C8"
                value={taskTitle}
                onChangeText={setTaskTitle}
                maxLength={50}
            />

            <TextInput
                style={[CreateStyles.input, { height: 120, textAlignVertical: 'top' }]}
                placeholder="Detalhes da Missão..."
                placeholderTextColor="#4E54C8"
                multiline
                value={taskDetails}
                onChangeText={setTaskDetails}
                maxLength={500}
            />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 }}>
                {[50, 100, 500, 1000, 2000].map((points) => (
                    <TouchableOpacity
                        key={points}
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: taskPoints === points ? '#7C83FD' : '#4E54C8'
                        }}
                        onPress={() => setTaskPoints(points)}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                            {points} pontos
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
                <TouchableOpacity style={CreateStyles.botaoAdicionar} onPress={() => router.replace('/')}>
                    <Text style={{ color: '#E0E5FF' }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[CreateStyles.botaoAdicionar, { backgroundColor: '#7C83FD' }]}
                    onPress={handleUpdateQuest}
                >
                    <Text style={{ color: '#0A0F24', fontWeight: 'bold' }}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
