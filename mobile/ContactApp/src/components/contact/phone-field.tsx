import { StyleSheet, Text, View } from 'react-native';

import { FormField, type FormFieldProps } from './form-field';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPhone, PHONE_COUNTRY_CODE } from '@/utils/phone';

function PhonePrefix() {
  const theme = useTheme();

  return (
    <View style={styles.prefix}>
      <Text style={styles.flag}>🇺🇸</Text>
      <ThemedText type="smallBold">{PHONE_COUNTRY_CODE}</ThemedText>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
    </View>
  );
}

export function PhoneField({ onChangeText, ...props }: FormFieldProps) {
  return (
    <FormField
      keyboardType="phone-pad"
      autoComplete="tel-national"
      textContentType="telephoneNumber"
      placeholder="(555) 123-4567"
      {...props}
      prefix={<PhonePrefix />}
      onChangeText={(text) => onChangeText?.(formatPhone(text))}
    />
  );
}

const styles = StyleSheet.create({
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  flag: {
    fontSize: 18,
  },
  divider: {
    width: 1,
    height: 22,
    marginLeft: Spacing.one,
  },
});
