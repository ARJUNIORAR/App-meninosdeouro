import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

type Aluno = {
  id: string;
  nome: string;
};

type Time = {
  id: number;
  jogadores: Aluno[];
};

export default function TimesSorteados() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [times, setTimes] = useState<Time[]>([]);
  
  // Função para sortear times otimizada com useCallback
  const sortearTimes = useCallback((alunos: Aluno[]) => {
    try {
      // Verifica se há alunos suficientes
      if (alunos.length < 4) {
        Alert.alert('Aviso', 'São necessários pelo menos 4 alunos para formar times');
        return;
      }

      // Embaralha os alunos de forma mais eficiente
      const alunosEmbaralhados = [...alunos];
      for (let i = alunosEmbaralhados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [alunosEmbaralhados[i], alunosEmbaralhados[j]] = [alunosEmbaralhados[j], alunosEmbaralhados[i]];
      }
      
      // Divide em times de 4 jogadores
      const novosTimes: Time[] = [];
      for (let i = 0; i < alunosEmbaralhados.length; i += 4) {
        const time: Time = {
          id: novosTimes.length + 1,
          jogadores: alunosEmbaralhados.slice(i, Math.min(i + 4, alunosEmbaralhados.length))
        };
        novosTimes.push(time);
      }
      
      setTimes(novosTimes);
    } catch (error) {
      console.error('Erro ao sortear times:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao sortear os times');
    }
  }, []);

  // Efeito para carregar os alunos dos parâmetros
  useEffect(() => {
    try {
      if (params.alunosSelecionados) {
        const alunos = JSON.parse(params.alunosSelecionados as string);
        if (Array.isArray(alunos) && alunos.length > 0) {
          sortearTimes(alunos);
        } else {
          Alert.alert('Aviso', 'Nenhum aluno disponível para sorteio');
        }
      }
    } catch (error) {
      console.error('Erro ao parsear alunos:', error);
      Alert.alert('Erro', 'Dados de alunos inválidos');
    }
  }, [params.alunosSelecionados, sortearTimes]);

  const handleNovoSorteio = () => {
    if (params.alunosSelecionados) {
      try {
        const alunos = JSON.parse(params.alunosSelecionados as string);
        sortearTimes(alunos);
      } catch (error) {
        console.error('Erro ao sortear novamente:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TIMES SORTEADOS</Text>
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleNovoSorteio}
          disabled={!params.alunosSelecionados}
        >
          <Text style={styles.buttonText}>Sortear Novamente</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de times */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.scrollContent}>
        {times.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum time formado</Text>
        ) : (
          times.map(time => (
            <View key={`time-${time.id}`} style={styles.timeContainer}>
              <Text style={styles.timeTitle}>Time {time.id}</Text>
              
              {time.jogadores.map((jogador, index) => (
                <View key={`jogador-${jogador.id}-${index}`} style={styles.jogadorItem}>
                  <Text style={styles.jogadorNome}>{index + 1}. {jogador.nome}</Text>
                </View>
              ))}
            </View>
          ))
        )}
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
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  timeContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  timeTitle: {
    color: '#DB9723',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  jogadorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  jogadorNome: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});