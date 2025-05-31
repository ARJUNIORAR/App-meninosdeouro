import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image,StyleSheet, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from './api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CadastroScreen() {
  const [edition,setEdition] = useState(false);
  const router = useRouter();
  const localParams = useLocalSearchParams()
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    genero: '',
    contatoResponsavel: '',
    endereco: '',
    cidade: '',
    cep: '',
    nomeResponsavel: ''
  });

  useEffect(()=>{
    if (localParams.modoEdicao) {
      setEdition(localParams.modoEdicao)
      api.get(`/aluno/${localParams.alunoId}`).then(resp=>{
        console.log(resp.data)
        setForm(resp.data)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[0])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);             
    }
  };

  const maskCpf = (value: string): string=> {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

const maskPhone = (value: string): string=>{
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

const maskDate = (value: string): string=> {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1');
}

  const handleSubmit = async() => {
    const formulario = new FormData()
    console.log(image)
    // Validação dos campos obrigatórios
    if (!form.nomeCompleto || !form.dataNascimento || !form.genero || 
        !form.cidade || !form.cep || !form.nomeResponsavel) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    formulario.append('nome', form.nomeCompleto)
    formulario.append('dt_nasc', form.dataNascimento)
    formulario.append('genero', form.genero)
    formulario.append('cidade', form.cidade)
    formulario.append('cep', form.cep)
    formulario.append('nome_resp', form.nomeResponsavel)
    formulario.append('cont_resp', form.contatoResponsavel)
    formulario.append('rg', form.rg)
    formulario.append('cpf', form.cpf)
    formulario.append('professorEmail',`${await AsyncStorage.getItem('email')}`)
    

    if (image) formulario.append('foto',{
      uri:image,
      type: `image/${image.split('/')[image.split('/').length-1].split('.')[1]}`,
      name:`${image.split('/')[image.split('/').length-1]}`
    }as any)
    console.log(formulario)

    api.post('/aluno/', formulario, {
      headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(resp=>{
      Alert.alert('Cadastro realizado com sucesso!')
      router.back();
    }).catch(()=>{
      Alert.alert('Erro ao cadastrar aluno')
    })

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
        value={form.nomeCompleto}
        onChangeText={(text) => setForm({...form, nomeCompleto: text})}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Data de Nascimento"
        value={form.dataNascimento}
        onChangeText={(text) => setForm({...form, dataNascimento: maskDate (text)})}
        mode="outlined"
        style={styles.input}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <TextInput
        label="CPF"
        value={form.cpf}
        onChangeText={(text) => setForm({...form, cpf: maskCpf(text)})}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="RG"
        value={form.rg}
        onChangeText={(text) => setForm({...form, rg: text})}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Gênero */}
      <Text style={styles.sectionTitle}>Gênero</Text>
      <RadioButton.Group
        onValueChange={(value) => setForm({...form, genero: value})}
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
        value={form.contatoResponsavel}
        onChangeText={(text) => setForm({...form, contatoResponsavel: maskPhone (text)})}
        mode="outlined"
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        label="Endereço"
        value={form.endereco}
        onChangeText={(text) => setForm({...form, endereco: text})}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Cidade"
        value={form.cidade}
        onChangeText={(text) => setForm({...form, cidade: text})}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="CEP"
        value={form.cep}
        onChangeText={(text) => setForm({...form, cep: text})}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Nome do Responsável *"
        value={form.nomeResponsavel}
        onChangeText={(text) => setForm({...form, nomeResponsavel: text})}
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