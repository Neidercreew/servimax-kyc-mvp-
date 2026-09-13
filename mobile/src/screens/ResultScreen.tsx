import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import ProgressSteps from '../components/ProgressSteps';
import ErrorState from '../components/ErrorState';
import Svg, { Circle } from 'react-native-svg';

type Veredicto = 'validated' | 'requires_review' | 'not_validated';

const veredictoInfo: Record<
  Veredicto,
  { color: string; bg: string; titulo: string; subtitulo: string }
> = {
  validated: {
    color: '#1FA65A',
    bg: '#EAF5EE',
    titulo: '¡Todo listo!',
    subtitulo: 'Tu registro fue validado exitosamente.',
  },
  requires_review: {
    color: '#E0A62D',
    bg: '#FDF3E0',
    titulo: 'Necesitamos revisar esto',
    subtitulo: 'Algunos datos requieren atención adicional.',
  },
  not_validated: {
    color: '#D14545',
    bg: '#FBE9E9',
    titulo: 'No pudimos validar tu registro',
    subtitulo: 'Por favor contacta a soporte para más información.',
  },
};

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const { applicationId } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);
  const [veredicto, setVeredicto] = useState<Veredicto>('validated');
  const [razones, setRazones] = useState<string[]>([]);

  const fetchResult = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.6:3000/applications/${applicationId}`
      );
      if (!response.ok) throw new Error('No se pudo obtener el resultado');
      const data = await response.json();
      setScore(data.score ?? 0);
      setVeredicto(data.veredicto ?? 'requires_review');
      setRazones(data.razones ? data.razones.split('|') : []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Calculando tu resultado...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="No pudimos cargar tu resultado. Verifica tu conexión e intenta de nuevo."
        onRetry={fetchResult}
      />
    );
  }

  const info = veredictoInfo[veredicto];
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <View style={styles.container}>
      <ProgressSteps currentStep={3} />

      <View style={styles.ringWrapper}>
        <Svg width={180} height={180} viewBox="0 0 180 180">
          <Circle cx="90" cy="90" r={radius} stroke="#EFEFEF" strokeWidth={14} fill="none" />
          <Circle
            cx="90"
            cy="90"
            r={radius}
            stroke={info.color}
            strokeWidth={14}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            rotation="-90"
            origin="90, 90"
          />
        </Svg>
        <View style={styles.scoreTextWrapper}>
          <Text style={[styles.scoreText, { color: info.color }]}>{score}</Text>
        </View>
      </View>

      <Text style={[styles.titulo, { color: info.color }]}>{info.titulo}</Text>
      <Text style={styles.subtitulo}>{info.subtitulo}</Text>

      <View style={[styles.reasonsCard, { backgroundColor: info.bg }]}>
        {razones.map((razon, index) => (
          <Text key={index} style={styles.reasonText}>
            • {razon}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: info.color }]}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.buttonText}>Continuar</Text>
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
  ringWrapper: {
    alignSelf: 'center',
    marginVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextWrapper: {
    position: 'absolute',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  reasonsCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  reasonText: {
    fontSize: 13,
    color: colors.text,
  },
  button: {
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
});