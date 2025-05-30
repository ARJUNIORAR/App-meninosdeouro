import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import api from './api/api';

type AlunoParams = {
  alunoId?: string;
  modoEdicao?: string;
};

export default function CadastrarAluno() {
  const router = useRouter();
  const params = useLocalSearchParams<AlunoParams>();
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const [alunoId, setAlunoId] = useState<string | null>(null);

  // Carrega os dados do aluno se for edição
  useEffect(() => {
    if (params.alunoId && params.modoEdicao === 'true') {
      setIsEdicao(true);
      setAlunoId(params.alunoId);
      carregarAluno(params.alunoId);
    }
  }, [params]);

  const carregarAluno = async (id: string) => {
    try {
      const response = await api.get(`/alunos/${id}`);
      setNome(response.data.nome);
      setFoto(response.data.foto || null);
    } catch (error) {
      console.error('Erro ao carregar aluno:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do aluno');
    }
  };

  const selecionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setFoto(manipResult.uri);
    }
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera para tirar uma foto');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      setFoto(manipResult.uri);
    }
  };

  const salvarAluno = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do aluno');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nome', nome);

      if (foto && !foto.startsWith('http')) {
        // @ts-ignore
        formData.append('foto', {
          uri: foto,
          name: 'foto.jpg',
          type: 'image/jpeg',
        });
      }

      if (isEdicao && alunoId) {
        await api.put(`/alunos/${alunoId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
      } else {
        await api.post('/alunos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      }

      router.back();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', `Não foi possível ${isEdicao ? 'atualizar' : 'cadastrar'} o aluno`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isEdicao ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </Text>

        <TextInput
          label="Nome do Aluno"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.fotoContainer}>
          {foto && (
            <View style={styles.fotoPreviewContainer}>
              <Text style={styles.fotoLabel}>Foto do aluno:</Text>
              <Image source={{ uri: foto }} style={styles.fotoPreview} />
            </View>
          )}

          <View style={styles.fotoButtons}>
            <Button
              mode="contained"
              onPress={selecionarFoto}
              style={styles.fotoButton}
              icon="image"
            >
              {foto ? 'Alterar' : 'Galeria'}
            </Button>

            <Button
              mode="contained"
              onPress={tirarFoto}
              style={styles.fotoButton}
              icon="camera"
            >
              Câmera
            </Button>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={salvarAluno}
          style={styles.submitButton}
          loading={loading}
          disabled={loading}
        >
          {isEdicao ? 'Atualizar' : 'Cadastrar'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          Cancelar
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#DB9723',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  fotoContainer: {
    marginBottom: 20,
  },
  fotoLabel: {
    color: '#fff',
    marginBottom: 8,
  },
  fotoPreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  fotoPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#DB9723',
  },
  fotoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fotoButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#DB9723',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#DB9723',
    paddingVertical: 5,
  },
  cancelButton: {
    marginTop: 15,
    borderColor: '#DB9723',
  },
});