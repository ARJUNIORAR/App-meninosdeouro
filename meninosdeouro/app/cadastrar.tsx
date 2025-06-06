import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from './api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CadastroScreen() {
  const [imageChange, setImageChange] = useState(false)
  const [edition, setEdition] = useState(false);
  const router = useRouter();
  const localParams = useLocalSearchParams()
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    nome: '',
    dt_nasc: '',
    cpf: '',
    rg: '',
    genero: '',
    cont_resp: '',
    endereco: '',
    cidade: '',
    cep: '',
    nome_resp: ''
  });

  useEffect(() => {
    if (localParams.modoEdicao) {
      setEdition(localParams.modoEdicao)
      api.get(`/aluno/${localParams.alunoId}`).then(resp => {
        const novaData = resp.data.dt_nasc.split('-')
        setForm({ ...resp.data, dt_nasc: `${novaData[2]}/${novaData[1]}/${novaData[0]}` })
        setImage(resp.data.foto !== null ? `${api.getUri()}/${resp.data.foto}` : null);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [0])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageChange(true)
    }
  };

  const maskCpf = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  const maskPhone = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }

  const maskDate = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  }

  const handleSubmit = async () => {
    const formulario = new FormData()
    // Validação dos campos obrigatórios
    if (!form.nome || !form.dt_nasc || !form.genero ||
      !form.cidade || !form.cep || !form.nome_resp) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    if (!edition) {
      const novaData = form.dt_nasc.split('/')
      formulario.append('nome', form.nome)
      formulario.append('dt_nasc', `${novaData[2]}-${novaData[1]}-${novaData[0]}`)
      formulario.append('genero', form.genero)
      formulario.append('cidade', form.cidade)
      formulario.append('cep', form.cep)
      formulario.append('nome_resp', form.nome_resp)
      formulario.append('cont_resp', form.cont_resp)
      formulario.append('rg', form.rg)
      formulario.append('cpf', form.cpf)
      formulario.append('professorEmail', `${await AsyncStorage.getItem('email')}`)
    } else {
      const novaData = form.dt_nasc.split('/')
      formulario.append('id', form.id)
      formulario.append('nome', form.nome)
      formulario.append('dt_nasc', `${novaData[2]}-${novaData[1]}-${novaData[0]}`)
      formulario.append('genero', form.genero)
      formulario.append('cidade', form.cidade)
      formulario.append('cep', form.cep)
      formulario.append('nome_resp', form.nome_resp)
      formulario.append('cont_resp', form.cont_resp)
      formulario.append('rg', form.rg)
      formulario.append('cpf', form.cpf)
      formulario.append('professorEmail', `${await AsyncStorage.getItem('email')}`)
    }



    if (image && imageChange) formulario.append('foto', {
      uri: image,
      type: `image/${image.split('/')[image.split('/').length - 1].split('.')[1]}`,
      name: `${image.split('/')[image.split('/').length - 1]}`
    } as any)
    console.log(formulario)
    if (!edition) {
      api.post('/aluno/', formulario, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(resp => {
        Alert.alert('Cadastro realizado com sucesso!')
        router.dismissAll()
        //router.back();
        router.replace('home')
      }).catch(() => {
        Alert.alert('Erro ao cadastrar aluno')
      })

    } else {
      api.put('/aluno/', formulario, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(resp => {
        Alert.alert('Aluno atualizado com sucesso!')
        router.dismissAll()
        //router.back();
        router.replace('home')
      }).catch(() => {
        Alert.alert('Erro ao cadastrar aluno')
      })
    }



  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      {/* Upload de Foto */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>+ Adicionar Foto</Text>
        )}
      </TouchableOpacity>

      {/* Campos do formulário */}
      <TextInput
        label="Nome Completo"
        value={form.nome}
        onChangeText={(text) => setForm({ ...form, nome: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Data de Nascimento"
        value={form.dt_nasc}
        onChangeText={(text) => setForm({ ...form, dt_nasc: maskDate(text) })}
        mode="outlined"
        style={styles.input}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <TextInput
        label="CPF"
        value={form.cpf}
        onChangeText={(text) => setForm({ ...form, cpf: maskCpf(text) })}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="RG"
        value={form.rg}
        onChangeText={(text) => setForm({ ...form, rg: text })}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Gênero */}
      <Text style={styles.sectionTitle}>Gênero</Text>
      <RadioButton.Group
        onValueChange={(value) => setForm({ ...form, genero: value })}
        value={form.genero}
      >
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Masculino" value="masculino" color="#D99D36" />
          <RadioButton.Item label="Feminino" value="feminino" color="#D99D36" />
          <RadioButton.Item label="Outro" value="outro" color="#D99D36" />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Contato do Responsável"
        value={form.cont_resp}
        onChangeText={(text) => setForm({ ...form, cont_resp: maskPhone(text) })}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        label="Endereço"
        value={form.endereco}
        onChangeText={(text) => setForm({ ...form, endereco: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Cidade"
        value={form.cidade}
        onChangeText={(text) => setForm({ ...form, cidade: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="CEP"
        value={form.cep}
        onChangeText={(text) => setForm({ ...form, cep: text })}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Nome do Responsável *"
        value={form.nome_resp}
        onChangeText={(text) => setForm({ ...form, nome_resp: text })}
        mode="outlined"
        style={styles.input}
      />

      {/* Botão de cadastro */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Cadastrar Aluno
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D99D36',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#1a1a1a',
    borderRadius: 75,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D99D36',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  imagePlaceholder: {
    color: '#D99D36',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#D9D7DB',
    color: '#D9D7DB',
  },
  sectionTitle: {
    color: '#D99D36',
    marginBottom: 10,
    marginTop: 5,
  },
  radioContainer: {
    marginBottom: 15,
    backgroundColor: '#D9D7DB',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#DBAC2A',
  },
  buttonLabel: {
    color: '',
    fontWeight: 'bold',
  },
});