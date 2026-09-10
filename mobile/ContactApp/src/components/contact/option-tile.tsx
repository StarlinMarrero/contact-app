import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionTileProps = {
  label: string;
  icon: SymbolViewProps['name'];
  selected: boolean;
  invalid?: boolean;
  onPress: () => void;
};

export function OptionTile({ label, icon, selected, invalid, onPress }: OptionTileProps) {
  const theme = useTheme();
  const borderColor = selected ? theme.accent : invalid ? theme.danger : theme.border;

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: selected ? theme.accentSoft : theme.background, borderColor },
        pressed && styles.pressed,
      ]}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: selected ? theme.accent : theme.backgroundElement },
          ]}>
          <SymbolView name={icon} size={18} tintColor={selected ? theme.onAccent : theme.textSecondary} />
        </View>
        <View style={[styles.radio, { borderColor: selected ? theme.accent : theme.border }]}>
          {selected ? <View style={[styles.radioDot, { backgroundColor: theme.accent }]} /> : null}
        </View>
      </View>
      <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'} numberOfLines={3}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexBasis: 96,
    minHeight: 108,
    padding: Spacing.three - Spacing.one,
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    gap: Spacing.two + Spacing.half,
    justifyContent: 'space-between',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
