import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HomeSettingsModal = ({ showModal, onClose, onLogout }) => {
  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.settingsModal}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={20} color="#ef4444" />
            <Text style={styles.settingsText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  settingsModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    padding: Math.max(24, width * 0.06),
    borderRadius: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default HomeSettingsModal; 