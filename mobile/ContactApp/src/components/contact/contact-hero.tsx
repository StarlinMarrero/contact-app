import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Brand, Fonts, Gradients, Spacing } from '@/constants/theme';

const GOLD = Brand.gold;

type ContactHeroProps = {
  completed: number;
  total: number;
};

export function ContactHero({ completed, total }: ContactHeroProps) {
  const progress = useSharedValue(completed / total);

  useEffect(() => {
    progress.set(withTiming(completed / total, { duration: 400 }));
  }, [completed, total, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />

      <View style={styles.eyebrowRow}>
        <SymbolView
          name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
          size={14}
          tintColor={GOLD}
        />
        <Text style={styles.eyebrow}>GET IN TOUCH</Text>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {"Let's talk business"}
      </Text>
      <Text style={styles.subtitle}>
        Tell us about your company and what you need. Our team will get back to you shortly.
      </Text>

      <View
        style={styles.progress}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Form progress"
        accessibilityValue={{ min: 0, max: total, now: completed }}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Your progress</Text>
          <Text style={styles.progressValue}>
            {completed}/{total} sections
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, fillStyle]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.two + Spacing.half,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: GOLD,
  },
  orbTop: {
    width: 180,
    height: 180,
    top: -70,
    right: -50,
    opacity: 0.14,
  },
  orbBottom: {
    width: 120,
    height: 120,
    bottom: -60,
    left: -30,
    opacity: 0.08,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  eyebrow: {
    color: GOLD,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.6,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 600,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 15,
    lineHeight: 22,
  },
  progress: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    fontWeight: 600,
  },
  progressValue: {
    color: GOLD,
    fontSize: 13,
    fontWeight: 700,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: GOLD,
  },
});
