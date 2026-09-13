import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import ProgressSteps from '../components/ProgressSteps';
import BackButton from '../components/BackButton';

export default function DocumentReviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DocumentReview'>>();
  const { applicationId } = route.params;

  const [loading, setLoading] = useState(true);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  useEffect(() => {
    const runOcr = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.6:3000/applications/${applicationId}/ocr`,
          { method: 'POST' }
        );
        const data = await response.json();
        setNombres(data.nombres);
        setApellidos(data.apellidos);
        setNumeroDocumento(data.numeroDocumento);
        setFechaNacimiento(data.fechaNacimiento);
      } catch (error) {
        console.error('Error en OCR:', error);
      } finally {
        setLoading(false);
      }
    };
    runOcr();
  }, []);

  const handleConfirm = () => {
    navigation.navigate('DocumentReview', { applicationId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Procesando tu documento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <ProgressSteps currentStep={2} />

      <Text style={styles.title}>Revisa tus datos</Text>
      <Text style={styles.subtitle}>
        Extraídos de tu documento. Corrige si algo está mal.
      </Text>
      <View style={styles.testBanner}>
        <Text style={styles.testBannerText}>
            🧪 Modo prueba: estos datos son generados por un OCR simulado, no por análisis real de tu foto.
        </Text>
    </View>

      <Text style={styles.label}>Nombres</Text>
      <TextInput style={styles.input} value={nombres} onChangeText={setNombres} />

      <Text style={styles.label}>Apellidos</Text>
      <TextInput style={styles.input} value={apellidos} onChangeText={setApellidos} />

      <Text style={styles.label}>Número de documento</Text>
      <TextInput
        style={styles.input}
        value={numeroDocumento}
        onChangeText={setNumeroDocumento}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TextInput
        style={styles.input}
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  testBanner: {
    backgroundColor: '#FFF7E6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  testBannerText: {
    fontSize: 12,
    color: '#8A6D1D',
    lineHeight: 17,
  },
});