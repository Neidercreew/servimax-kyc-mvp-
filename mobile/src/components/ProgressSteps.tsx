import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const steps = ['Contacto', 'Documento', 'Verificar', 'Resultado'];

type Props = {
  currentStep: number;
};

export default function ProgressSteps({ currentStep }: Props) {
  const fillPercent = (currentStep / (steps.length - 1)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.trackWrapper}>
        <View style={styles.track} />
        <View style={[styles.trackFill, { width: `${fillPercent}%` }]} />

        <View style={styles.circlesRow}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.circle,
                index < currentStep && styles.circleDone,
                index === currentStep && styles.circleActive,
              ]}
            >
              {index < currentStep && (
                <Ionicons name="checkmark" size={13} color="#fff" />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.labelsRow}>
        {steps.map((label, index) => (
          <Text
            key={label}
            style={[styles.label, index <= currentStep && styles.labelActive]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  trackWrapper: {
    height: 26,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  track: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    left: 13,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  circlesRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  circleActive: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 10,
    color: colors.textLight,
    width: 60,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});