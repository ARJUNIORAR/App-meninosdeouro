import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const router = useRouter();
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validação dos campos obrigatórios
    if (!form.nomeCompleto || !form.dataNascimento || !form.genero || 
        !form.cidade || !form.cep || !form.nomeResponsavel) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    //submissão para seu banco de dados
    console.log('Dados do aluno:', { image, ...form });
    alert('Cadastro realizado com sucesso!');
    router.back();
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
        label="Nome Completo *"
        value={form.nomeCompleto}
        onChangeText={(text) => setForm({...form, nomeCompleto: text})}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Data de Nascimento *"
        value={form.dataNascimento}
        onChangeText={(text) => setForm({...form, dataNascimento: text})}
        mode="outlined"
        style={styles.input}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <TextInput
        label="CPF"
        value={form.cpf}
        onChangeText={(text) => setForm({...form, cpf: text})}
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
      <Text style={styles.sectionTitle}>Gênero *</Text>
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
        onChangeText={(text) => setForm({...form, contatoResponsavel: text})}
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
        label="Cidade *"
        value={form.cidade}
        onChangeText={(text) => setForm({...form, cidade: text})}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="CEP *"
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

const styles = {
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
};