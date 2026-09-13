import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import BackgroundCurves from '../components/BackgroundCurves';//--utiliza las curvas creadas en la carpeta de components
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
//se traen las piezas ya hechas por react native. el view es parecido a un div, el text es para mostrar texto, el touchableopacity es un boton que se puede presionar y el stylesheet es para crear estilos de manera mas organizada.
export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <BackgroundCurves />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🏪</Text>
        </View>
        <Text style={styles.brand}>SERVIMAX</Text>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.description}>
          Registra tu negocio de forma fácil y segura, en pocos pasos.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryButton}
          onPress={() => navigation.navigate('ContactData')}
        >
          <Text style={styles.primaryButtonText}>Quiero registrarme</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Ya estoy registrado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    paddingTop: 130,
    paddingBottom: 32,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  iconEmoji: {
    fontSize: 34,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.onPrimaryText,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: colors.onPrimaryTextSoft,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  buttons: {
    paddingHorizontal: 28,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '600',
  },
  arrow: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  secondaryButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '600',
  },
});