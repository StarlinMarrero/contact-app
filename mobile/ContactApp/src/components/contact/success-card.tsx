import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { GradientButton } from './gradient-button';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SuccessCardProps = {
  firstName: string;
  email: string;
  emailSent: boolean;
  referenceId: string;
  onReset: () => void;
};

export function SuccessCard({ firstName, email, emailSent, referenceId, onReset }: SuccessCardProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <Animated.View
          entering={ZoomIn.delay(150).springify()}
          style={[styles.checkCircle, { backgroundColor: theme.success }]}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={36}
            weight="bold"
            tintColor="#FFFFFF"
          />
        </Animated.View>

        <View style={styles.texts}>
          <ThemedText style={styles.title} accessibilityRole="header">
            Message sent!
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            Thanks, {firstName}. We received your request and our team will reach out soon.
          </ThemedText>
        </View>

        <View
          style={[
            styles.infoRow,
            { backgroundColor: emailSent ? theme.successSoft : theme.background },
          ]}>
          <SymbolView
            name={
              emailSent
                ? { ios: 'envelope.badge', android: 'mark_email_read', web: 'mark_email_read' }
                : { ios: 'exclamationmark.circle', android: 'info', web: 'info' }
            }
            size={20}
            tintColor={emailSent ? theme.success : theme.textSecondary}
          />
          <ThemedText type="small" style={styles.flex}>
            {emailSent
              ? `A confirmation email with a PDF copy was sent to ${email}.`
              : `Your request was saved, but we couldn't send the confirmation email to ${email} right now.`}
          </ThemedText>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          Reference #{referenceId.slice(0, 8).toUpperCase()}
        </ThemedText>

        <View style={styles.button}>
          <GradientButton
            label="Send another message"
            icon={{ ios: 'arrow.counterclockwise', android: 'refresh', web: 'refresh' }}
            onPress={onReset}
          />
        </View>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  texts: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 600,
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  infoRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
    padding: Spacing.three - Spacing.one,
    borderRadius: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
});
