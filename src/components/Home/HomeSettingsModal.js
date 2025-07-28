import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const HomeSettingsModal = ({ showModal, onClose, onLogout }) => {
  console.log('🔧 HomeSettingsModal render - showModal:', showModal);
  
  const handleLogout = () => {
    console.log('🔧 Logout button pressed!');
    onLogout();
  };
  
  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutGradient}>
              <View style={styles.iconContainer}>
                <Icon name="logout" size={Math.max(20, width * 0.05)} color="#ef4444" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.settingsText}>Logout</Text>
                <Text style={styles.settingsSubtext}>Sign out of your account</Text>
              </View>
              <Icon name="chevron-right" size={Math.max(20, width * 0.05)} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: '#1e293b',
    padding: 24,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  settingsSubtext: {
    fontSize: 12,
    color: 'rgba(148, 163, 184, 0.8)',
    marginTop: 2,
  },
});

export default HomeSettingsModal; 