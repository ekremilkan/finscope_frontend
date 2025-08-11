import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { EMAIL_VERIFICATION_DATA } from '../../data/emailVerificationData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const EmailVerificationInput = ({ 
  code, 
  onCodeChange, 
  disabled = false,
  hasError = false,
  autoFocus = true 
}) => {
  const inputRefs = useRef([]);
  const codeLength = EMAIL_VERIFICATION_DATA.codeLength;

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleTextChange = (text, index) => {
    if (disabled) return;

    // Sadece rakam kabul et
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= 1) {
      const newCode = code.split('');
      newCode[index] = numericText;
      
      const updatedCode = newCode.join('');
      onCodeChange(updatedCode);

      // Bir sonraki input'a geç
      if (numericText && index < codeLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (numericText.length === codeLength) {
      // Tüm kodu yapıştır
      onCodeChange(numericText);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (disabled) return;

    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Mevcut input boşsa önceki input'a geç
        inputRefs.current[index - 1]?.focus();
        const newCode = code.split('');
        newCode[index - 1] = '';
        onCodeChange(newCode.join(''));
      }
    }
  };

  const handleFocus = (index) => {
    // Input'a tıklandığında o pozisyondan itibaren seç
    const input = inputRefs.current[index];
    if (input) {
      input.setSelection(0, 1);
    }
  };

  const getInputStyle = (index) => {
    const baseStyle = [styles.input];
    
    if (disabled) {
      baseStyle.push(styles.inputDisabled);
    } else if (hasError) {
      baseStyle.push(styles.inputError);
    } else if (code[index]) {
      baseStyle.push(styles.inputFilled);
    }
    
    return baseStyle;
  };

  const getGradientColors = (index) => {
    if (disabled) {
      return [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80'];
    } else if (hasError) {
      return [`${COLORS.ERROR}20`, `${COLORS.ERROR}10`];
    } else if (code[index]) {
      return [`${COLORS.PRIMARY}20`, `${COLORS.PRIMARY}10`];
    } else {
      return [COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND];
    }
  };

  const getBorderColor = (index) => {
    if (disabled) {
      return COLORS.BORDER_DISABLED;
    } else if (hasError) {
      return COLORS.ERROR;
    } else if (code[index]) {
      return COLORS.PRIMARY;
    } else {
      return COLORS.BORDER_SECONDARY;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: codeLength }, (_, index) => (
        <View key={index} style={styles.inputWrapper}>
          <LinearGradient
            colors={getGradientColors(index)}
            style={[
              styles.inputGradient,
              { borderColor: getBorderColor(index) }
            ]}
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={getInputStyle(index)}
              value={code[index] || ''}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
              placeholder="0"
              placeholderTextColor={COLORS.TEXT_SECONDARY + '60'}
              textAlign="center"
              returnKeyType={index === codeLength - 1 ? 'done' : 'next'}
              blurOnSubmit={index === codeLength - 1}
            />
          </LinearGradient>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(20, width * 0.05),
  },
  inputWrapper: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGradient: {
    width: Math.max(45, width * 0.12),
    height: Math.max(55, width * 0.14),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: Math.max(20, Math.min(24, width * 0.06)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  inputFilled: {
    // Gradient already applied
  },
  inputError: {
    // Gradient already applied
  },
  inputDisabled: {
    opacity: 0.5,
  },
});

export default EmailVerificationInput;