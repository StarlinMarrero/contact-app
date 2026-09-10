import { SymbolView } from 'expo-symbols';
import { useRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  type LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  type TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChoiceChip } from '@/components/contact/choice-chip';
import { ContactHero } from '@/components/contact/contact-hero';
import { FieldError, FormField } from '@/components/contact/form-field';
import { FormSection } from '@/components/contact/form-section';
import { GradientButton } from '@/components/contact/gradient-button';
import { OptionTile } from '@/components/contact/option-tile';
import { PhoneField } from '@/components/contact/phone-field';
import { SuccessCard } from '@/components/contact/success-card';
import { ThemedText } from '@/components/themed-text';
import {
  BUSINESS_TYPE_OPTIONS,
  CONTACT_REASON_OPTIONS,
  FieldLimits,
} from '@/constants/contact-form';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { type FormSectionKey, sectionOf, useContactForm } from '@/hooks/use-contact-form';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/utils/haptics';

export default function ContactScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const form = useContactForm();
  const { values, setField, markTouched, errorFor, submitState } = form;

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Partial<Record<FormSectionKey, number>>>({});
  const websiteRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const titleRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const corporatePhoneRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  const topOffset = Platform.OS === 'ios' ? insets.top : 0;

  function trackSection(key: FormSectionKey) {
    return (event: LayoutChangeEvent) => {
      sectionOffsets.current[key] = event.nativeEvent.layout.y;
    };
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ y: -topOffset, animated: true });
  }

  async function handleSubmit() {
    Keyboard.dismiss();
    const outcome = await form.submit();

    if (outcome.ok) {
      haptics.success();
      scrollToTop();
      return;
    }

    haptics.error();
    if (outcome.firstInvalidField) {
      const y = sectionOffsets.current[sectionOf(outcome.firstInvalidField)];
      if (y !== undefined) {
        scrollRef.current?.scrollTo({ y: y - Spacing.three - topOffset, animated: true });
      }
    }
  }

  function handleReset() {
    form.reset();
    scrollToTop();
  }

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

  const content = (
    <ScrollView
      ref={scrollRef}
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets>
      <View style={styles.container}>
        <ContactHero completed={form.completedSections} total={form.totalSections} />

        {submitState.status === 'success' ? (
          <SuccessCard
            firstName={values.firstName.trim()}
            email={values.corporateEmail.trim()}
            emailSent={submitState.result.emailSent}
            referenceId={submitState.result.id}
            onReset={handleReset}
          />
        ) : (
          <>
            <FormSection
              step={1}
              title="Business type"
              description="How do you sell to your customers?"
              complete={form.sectionComplete.business}
              onLayout={trackSection('business')}>
              <View style={styles.tiles} accessibilityRole="radiogroup">
                {BUSINESS_TYPE_OPTIONS.map((option) => (
                  <OptionTile
                    key={option.value}
                    label={option.label}
                    icon={option.icon}
                    selected={values.businessType === option.value}
                    invalid={!!errorFor('businessType')}
                    onPress={() => {
                      haptics.selection();
                      setField('businessType', option.value);
                    }}
                  />
                ))}
              </View>
              <FieldError message={errorFor('businessType')} />
            </FormSection>

            <FormSection
              step={2}
              title="Company information"
              complete={form.sectionComplete.company}
              onLayout={trackSection('company')}>
              <FormField
                label="Company name"
                required
                icon={{ ios: 'building.2', android: 'apartment', web: 'apartment' }}
                placeholder="Acme Inc."
                value={values.companyName}
                onChangeText={(text) => setField('companyName', text)}
                onBlur={() => markTouched('companyName')}
                error={errorFor('companyName')}
                maxLength={FieldLimits.companyName}
                autoComplete="organization"
                textContentType="organizationName"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => websiteRef.current?.focus()}
              />
              <FormField
                ref={websiteRef}
                label="Website"
                icon={{ ios: 'globe', android: 'language', web: 'language' }}
                placeholder="example.com"
                value={values.website}
                onChangeText={(text) => setField('website', text)}
                onBlur={() => markTouched('website')}
                error={errorFor('website')}
                maxLength={FieldLimits.website}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="url"
                textContentType="URL"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => firstNameRef.current?.focus()}
              />
            </FormSection>

            <FormSection
              step={3}
              title="Personal information"
              complete={form.sectionComplete.personal}
              onLayout={trackSection('personal')}>
              <View style={styles.row}>
                <FormField
                  ref={firstNameRef}
                  containerStyle={styles.flex}
                  label="First name"
                  required
                  placeholder="Jane"
                  value={values.firstName}
                  onChangeText={(text) => setField('firstName', text)}
                  onBlur={() => markTouched('firstName')}
                  error={errorFor('firstName')}
                  maxLength={FieldLimits.name}
                  autoComplete="given-name"
                  textContentType="givenName"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                <FormField
                  ref={lastNameRef}
                  containerStyle={styles.flex}
                  label="Last name"
                  required
                  placeholder="Doe"
                  value={values.lastName}
                  onChangeText={(text) => setField('lastName', text)}
                  onBlur={() => markTouched('lastName')}
                  error={errorFor('lastName')}
                  maxLength={FieldLimits.name}
                  autoComplete="family-name"
                  textContentType="familyName"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => titleRef.current?.focus()}
                />
              </View>
              <FormField
                ref={titleRef}
                label="Title"
                required
                icon={{ ios: 'briefcase', android: 'work', web: 'work' }}
                placeholder="Purchasing Manager"
                value={values.title}
                onChangeText={(text) => setField('title', text)}
                onBlur={() => markTouched('title')}
                error={errorFor('title')}
                maxLength={FieldLimits.title}
                autoComplete="organization-title"
                textContentType="jobTitle"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <FormField
                ref={emailRef}
                label="Corporate email"
                required
                icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                placeholder="jane@company.com"
                value={values.corporateEmail}
                onChangeText={(text) => setField('corporateEmail', text)}
                onBlur={() => markTouched('corporateEmail')}
                error={errorFor('corporateEmail')}
                maxLength={FieldLimits.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => corporatePhoneRef.current?.focus()}
              />
              <PhoneField
                ref={corporatePhoneRef}
                label="Corporate phone"
                value={values.corporatePhone}
                onChangeText={(text) => setField('corporatePhone', text)}
                onBlur={() => markTouched('corporatePhone')}
                error={errorFor('corporatePhone')}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => mobileRef.current?.focus()}
              />
              <PhoneField
                ref={mobileRef}
                label="Mobile"
                value={values.mobile}
                onChangeText={(text) => setField('mobile', text)}
                onBlur={() => markTouched('mobile')}
                error={errorFor('mobile')}
                hint="Provide at least one phone number (Corporate Phone or Mobile)."
                returnKeyType="done"
              />
            </FormSection>

            <FormSection
              step={4}
              title="Inquiry details"
              description="Select all that apply."
              complete={form.sectionComplete.inquiry}
              onLayout={trackSection('inquiry')}>
              <View style={styles.fieldGroup}>
                <ThemedText type="smallBold">
                  Reason for contact
                  <ThemedText type="smallBold" style={{ color: theme.danger }}>
                    {' *'}
                  </ThemedText>
                </ThemedText>
                <View style={styles.chips}>
                  {CONTACT_REASON_OPTIONS.map((option) => (
                    <ChoiceChip
                      key={option.value}
                      label={option.label}
                      selected={values.reasons.includes(option.value)}
                      invalid={!!errorFor('reasons')}
                      onPress={() => {
                        haptics.selection();
                        form.toggleReason(option.value);
                      }}
                    />
                  ))}
                </View>
                <FieldError message={errorFor('reasons')} />
              </View>
              <FormField
                label="Message"
                icon={{ ios: 'text.bubble', android: 'chat', web: 'chat' }}
                placeholder="Tell us more about your inquiry..."
                value={values.message}
                onChangeText={(text) => setField('message', text)}
                onBlur={() => markTouched('message')}
                error={errorFor('message')}
                maxLength={FieldLimits.message}
                showCounter
                multiline
              />
            </FormSection>

            {submitState.status === 'error' ? (
              <Animated.View
                entering={FadeIn.duration(200)}
                style={[styles.banner, { backgroundColor: theme.dangerSoft, borderColor: theme.danger }]}
                accessibilityRole="alert">
                <SymbolView
                  name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
                  size={18}
                  tintColor={theme.danger}
                />
                <ThemedText type="small" style={[styles.flex, { color: theme.danger }]}>
                  {submitState.message}
                </ThemedText>
              </Animated.View>
            ) : null}

            <GradientButton
              label="Send message"
              loadingLabel="Sending..."
              icon={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
              loading={submitState.status === 'submitting'}
              onPress={handleSubmit}
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.footnote}>
              {"We'll only use your details to respond to this inquiry."}
            </ThemedText>
          </>
        )}
      </View>
    </ScrollView>
  );

  return Platform.OS === 'android' ? (
    <KeyboardAvoidingView behavior="padding" style={styles.flex}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three - Spacing.one,
  },
  flex: {
    flex: 1,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.half,
    padding: Spacing.three - Spacing.one,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  footnote: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
});
