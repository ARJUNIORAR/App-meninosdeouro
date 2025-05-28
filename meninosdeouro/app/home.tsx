import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from './api/api';

type Aluno = {
  id: string;
  nome: string;
  selecionado: boolean;
};

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);


  useEffect(()=>{
    api.get('/alunos/').then(resp=>{
      setAlunos(resp.data.map((aluno: any)=>{
        return {id: aluno.id, nome: aluno.nome, selecionado: false}
      }))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [0])



  // Corrigido: alunosFiltrados agora é calculado com useMemo
  const alunosFiltrados = useMemo(() => {
    return alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [alunos, searchText]);

  const toggleSelecionado = (id: string) => {
    setAlunos(alunos.map(aluno => 
      aluno.id === id ? { ...aluno, selecionado: !aluno.selecionado } : aluno
    ));
  };

  const handleSortear = () => {
    const alunosParaSortear = alunos.filter(aluno => !aluno.selecionado);
    if (alunosParaSortear.length === 0) {
      alert('Todos os alunos estão marcados como não sorteados!');
      return;
    }
    
    router.push({
      pathname: '/timesSorteados',
      params: { alunosSelecionados: JSON.stringify(alunosParaSortear) }
    });
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>E.F.M.O: SH-PB</Text>
      </View>

      {/* Botões principais */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/cadastrar')}
        >
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSortear}
        >
          <Text style={styles.buttonText}>Sortear Aluno</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de pesquisa */}
      <TextInput
        label="Pesquisar aluno"
        value={searchText}
        onChangeText={setSearchText}
        mode="outlined"
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" />}
      />

      {/* Lista de alunos - Corrigido: usando alunosFiltrados corretamente */}
      <ScrollView style={styles.listContainer}>
        {alunosFiltrados.map(aluno => (
          <View key={aluno.id} style={styles.alunoItem}> {/*Tentar adicionar foto*/}
            <Checkbox
              status={aluno.selecionado ? 'checked' : 'unchecked'}
              onPress={() => toggleSelecionado(aluno.id)}
              color="#DB9723"
            />
            <Text style={styles.alunoNome}>{aluno.nome}</Text>
          </View>
        ))}
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
  header: {
    backgroundColor: '#DB9723',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DB9723',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  searchInput: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  alunoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  alunoNome: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});