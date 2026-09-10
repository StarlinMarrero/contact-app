import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type ReactNode, type Ref, useState } from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function FieldError({ message }: { message?: string }) {
  const theme = useTheme();
  if (!message) return null;

  return (
    <Animated.View entering={FadeIn.duration(150)} style={styles.messageRow}>
      <SymbolView
        name={{ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }}
        size={14}
        tintColor={theme.danger}
      />
      <ThemedText type="small" style={[styles.flex, { color: theme.danger }]} accessibilityRole="alert">
        {message}
      </ThemedText>
    </Animated.View>
  );
}

export type FormFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  required?: boolean;
  icon?: SymbolViewProps['name'];
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  showCounter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

export function FormField({
  label,
  required,
  icon,
  error,
  hint,
  prefix,
  showCounter,
  containerStyle,
  ref,
  multiline,
  value,
  maxLength,
  onFocus,
  onBlur,
  ...inputProps
}: FormFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.danger : focused ? theme.accent : theme.border;
  const counter = showCounter && maxLength ? `${value?.length ?? 0}/${maxLength}` : null;

  return (
    <View style={[styles.field, containerStyle]}>
      <ThemedText type="smallBold">
        {label}
        {required ? <ThemedText type="smallBold" style={{ color: theme.danger }}> *</ThemedText> : null}
      </ThemedText>

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          { backgroundColor: theme.background, borderColor },
        ]}>
        {icon ? (
          <SymbolView
            name={icon}
            size={18}
            tintColor={focused ? theme.accent : theme.textSecondary}
            style={multiline ? styles.iconMultiline : undefined}
          />
        ) : null}
        {prefix}
        <TextInput
          ref={ref}
          value={value}
          maxLength={maxLength}
          multiline={multiline}
          accessibilityLabel={label}
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          style={[styles.input, multiline && styles.inputMultiline, { color: theme.text }]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
      </View>

      {error ? (
        <FieldError message={error} />
      ) : hint || counter ? (
        <View style={styles.messageRow}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.flex}>
            {hint ?? ''}
          </ThemedText>
          {counter ? (
            <ThemedText type="small" themeColor="textSecondary">
              {counter}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  inputWrapper: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.three - Spacing.half,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
  },
  iconMultiline: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  inputMultiline: {
    minHeight: 132,
    textAlignVertical: 'top',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  flex: {
    flex: 1,
  },
});
