import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Brand, Gradients } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 184;
const TILE_SIZE = 112;

export function ContactIllustration() {
  const theme = useTheme();

  return (
    <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.wrapper} aria-hidden>
      <View style={[styles.ring, styles.ringOuter, { borderColor: theme.accent }]} />
      <View style={[styles.ring, styles.ringInner, { borderColor: theme.accent }]} />

      <LinearGradient
        colors={Gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tile}>
        <SymbolView
          name={{ ios: 'envelope.open.fill', android: 'drafts', web: 'drafts' }}
          size={52}
          tintColor={Brand.gold}
        />
      </LinearGradient>

      <Animated.View
        entering={FadeIn.delay(350).duration(300)}
        style={[styles.badge, { borderColor: theme.background }]}>
        <LinearGradient
          colors={Gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeFill}>
          <SymbolView
            name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            size={18}
            tintColor="#FFFFFF"
          />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  ringOuter: {
    width: SIZE,
    height: SIZE,
    opacity: 0.15,
  },
  ringInner: {
    width: SIZE - 36,
    height: SIZE - 36,
    opacity: 0.3,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(22, 19, 15, 0.35)',
  },
  badge: {
    position: 'absolute',
    right: 30,
    bottom: 34,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    overflow: 'hidden',
  },
  badgeFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
