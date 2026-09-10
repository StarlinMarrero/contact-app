import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/contact/gradient-button';
import { ContactIllustration } from '@/components/home/contact-illustration';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six + Spacing.four,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <View style={styles.container}>
        <ContactIllustration />

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.intro}>
          <ThemedText type="smallBold" style={[styles.eyebrow, { color: theme.accent }]}>
            CONTACT FORM DEMO
          </ThemedText>
          <ThemedText style={styles.title} accessibilityRole="header">
            Contact Form{'\n'}Test App
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.body}>
            This is a test app to send a contact form. Go to the Contact screen to try it out.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actions}>
          <GradientButton
            label="Go to Contact"
            icon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            onPress={() => router.navigate('/contact')}
          />
          <ThemedText type="small" themeColor="textSecondary" style={styles.credit}>
            Built by Starlin Marrero
          </ThemedText>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  intro: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 600,
    textAlign: 'center',
  },
  body: {
    maxWidth: 420,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.three,
  },
  credit: {
    textAlign: 'center',
  },
});
