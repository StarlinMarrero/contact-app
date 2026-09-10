import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Gradients, Spacing } from '@/constants/theme';

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  icon?: SymbolViewProps['name'];
  loading?: boolean;
  loadingLabel?: string;
};

export function GradientButton({ label, onPress, icon, loading, loadingLabel }: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-busy={loading}
      aria-disabled={loading}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, loading && styles.loading]}>
      <LinearGradient
        colors={Gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : icon ? (
          <SymbolView name={icon} size={18} tintColor="#FFFFFF" />
        ) : null}
        <Text style={styles.label}>{loading ? (loadingLabel ?? label) : label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Spacing.three,
    boxShadow: '0 8px 20px rgba(110, 81, 40, 0.35)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  loading: {
    opacity: 0.85,
  },
  button: {
    minHeight: 56,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
});
