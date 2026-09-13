import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import ProgressSteps from '../components/ProgressSteps';
import BackButton from '../components/BackButton';

type Side = 'front' | 'back';

export default function DocumentCaptureScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [side, setSide] = useState<Side>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frameHeight, setFrameHeight] = useState(0);

  const currentImage = side === 'front' ? frontImage : backImage;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(frameHeight - 2, 0)],
  });

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (!photo) return;
    if (side === 'front') setFrontImage(photo.uri);
    else setBackImage(photo.uri);
  };

  const handlePickFromGallery = async () => {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!galleryPermission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      aspect: [16, 10],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (side === 'front') setFrontImage(uri);
      else setBackImage(uri);
    }
  };

  const handleRetake = () => {
    if (side === 'front') setFrontImage(null);
    else setBackImage(null);
  };

  const handleUsePhoto = () => {
    if (side === 'front') {
      setSide('back');
    } else {
      navigation.navigate('DocumentReview');
    }
  };

  const handleBack = () => {
    if (side === 'back') {
      setSide('front');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={handleBack} />
      <ProgressSteps currentStep={1} />

      <View style={styles.sideIndicator}>
        <View style={[styles.sideDot, side === 'front' && styles.sideDotActive]}>
          <Text style={[styles.sideDotText, side === 'front' && styles.sideDotTextActive]}>
            Frente
          </Text>
        </View>
        <View style={styles.sideDivider} />
        <View style={[styles.sideDot, side === 'back' && styles.sideDotActive]}>
          <Text style={[styles.sideDotText, side === 'back' && styles.sideDotTextActive]}>
            Reverso
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        {side === 'front' ? 'Foto del frente' : 'Foto del reverso'}
      </Text>
      <Text style={styles.subtitle}>Alinea tu cédula dentro del marco.</Text>

      {currentImage ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: currentImage }} style={styles.previewImage} />
        </View>
      ) : (
        <View
          style={styles.frame}
          onLayout={(e) => setFrameHeight(e.nativeEvent.layout.height)}
        >
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
          ) : (
            <View style={styles.permissionFallback}>
              <Ionicons name="camera-outline" size={32} color={colors.primaryDark} />
              <Text style={styles.permissionText}>Necesitamos acceso a tu cámara</Text>
            </View>
          )}

          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY }] }]}
            pointerEvents="none"
          />
          <View style={[styles.corner, styles.cornerTL]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerTR]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerBL]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerBR]} pointerEvents="none" />
        </View>
      )}

      <View style={styles.tipsCard}>
        <View style={styles.tipRow}>
          <Ionicons name="sunny-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.tipText}>Busca buena iluminación</Text>
        </View>
        <View style={styles.tipRow}>
          <Ionicons name="document-text-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.tipText}>Colócalo sobre una superficie plana</Text>
        </View>
        <View style={styles.tipRow}>
          <Ionicons name="eye-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.tipText}>Que se vea completo y sin brillos</Text>
        </View>
      </View>

      {currentImage ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
            <Text style={styles.secondaryButtonText}>Volver a tomar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleUsePhoto}>
            <Text style={styles.primaryButtonText}>Usar esta foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCapture}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryLink} onPress={handlePickFromGallery}>
            <Ionicons name="images-outline" size={16} color={colors.primaryDark} />
            <Text style={styles.galleryLinkText}>Elegir de galería</Text>
          </TouchableOpacity>
        </>
      )}
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
  sideIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sideDot: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  sideDotActive: {
    backgroundColor: colors.primarySoft,
  },
  sideDotText: {
    fontSize: 11,
    color: colors.textLight,
  },
  sideDotTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  sideDivider: {
    width: 16,
    height: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 16,
  },
  frame: {
    aspectRatio: 1.586,
    borderWidth: 2.5,
    borderColor: colors.primary,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  permissionFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  permissionText: {
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderRadius: 4,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderRadius: 4,
  },
  previewWrapper: {
    aspectRatio: 1.586,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  tipsCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    fontSize: 12.5,
    color: colors.textLight,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonSmall: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 24,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  galleryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 24,
  },
  galleryLinkText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
});