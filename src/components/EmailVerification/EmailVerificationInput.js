import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Keyboard } from 'react-native';
import { EMAIL_VERIFICATION_DATA } from '../../data/emailVerificationData';

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

  return (
    <View style={styles.container}>
      {Array.from({ length: codeLength }, (_, index) => (
        <TextInput
          key={index}
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
          placeholderTextColor={EMAIL_VERIFICATION_DATA.colors.textSecondary + '60'}
          textAlign="center"
          returnKeyType={index === codeLength - 1 ? 'done' : 'next'}
          blurOnSubmit={index === codeLength - 1}
        />
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
  input: {
    width: Math.max(45, width * 0.12),
    height: Math.max(55, width * 0.14),
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.inputBackground,
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 2,
    borderColor: EMAIL_VERIFICATION_DATA.colors.borderColor,
    fontSize: Math.max(20, Math.min(24, width * 0.06)),
    fontWeight: 'bold',
    color: EMAIL_VERIFICATION_DATA.colors.text,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFilled: {
    borderColor: EMAIL_VERIFICATION_DATA.colors.borderActive,
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.primary}15`,
    shadowColor: EMAIL_VERIFICATION_DATA.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputError: {
    borderColor: EMAIL_VERIFICATION_DATA.colors.error,
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.error}15`,
    shadowColor: EMAIL_VERIFICATION_DATA.colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.inputBackground + '80',
  },
});

export default EmailVerificationInput;