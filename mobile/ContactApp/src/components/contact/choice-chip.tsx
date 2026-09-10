import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  invalid?: boolean;
  onPress: () => void;
};

export function ChoiceChip({ label, selected, invalid, onPress }: ChoiceChipProps) {
  const theme = useTheme();
  const borderColor = selected ? theme.accent : invalid ? theme.danger : theme.border;

  return (
    <Pressable
      accessibilityRole="checkbox"
      aria-checked={selected}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? theme.accentSoft : theme.background, borderColor },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name={
          selected
            ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
            : { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' }
        }
        size={16}
        tintColor={selected ? theme.accent : theme.textSecondary}
      />
      <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.three - Spacing.one,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
