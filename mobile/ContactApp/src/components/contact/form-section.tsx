import { SymbolView } from 'expo-symbols';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormSectionProps = PropsWithChildren<{
  step: number;
  title: string;
  description?: string;
  complete?: boolean;
  onLayout?: ViewProps['onLayout'];
}>;

export function FormSection({ step, title, description, complete, onLayout, children }: FormSectionProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card} onLayout={onLayout}>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            complete
              ? { backgroundColor: theme.accent, borderColor: theme.accent }
              : { backgroundColor: theme.background, borderColor: theme.border },
          ]}
          accessibilityLabel={complete ? `Step ${step} complete` : `Step ${step}`}>
          {complete ? (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={14}
              weight="bold"
              tintColor={theme.onAccent}
            />
          ) : (
            <ThemedText type="smallBold" themeColor="textSecondary">
              {step}
            </ThemedText>
          )}
        </View>
        <View style={styles.headerText}>
          <ThemedText style={styles.title} accessibilityRole="header">
            {title}
          </ThemedText>
          {description ? (
            <ThemedText type="small" themeColor="textSecondary">
              {description}
            </ThemedText>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three + Spacing.one,
    gap: Spacing.three + Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - Spacing.one,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  body: {
    gap: Spacing.three,
  },
});
