import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
// İkon kütüphanesi MaterialIcons olarak değiştirildi
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { getResponsiveSize } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const getInitials = (name) => {
  if (!name) return '?';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.substring(0, 2).toUpperCase();
};

const ProfileHeader = ({ user, onNameUpdate, isLoading = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPress = () => {
    setNewName(user?.name || '');
    setIsModalVisible(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      if (onNameUpdate) {
        await onNameUpdate(newName.trim());
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Name update failed:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setNewName(user?.name || '');
    setIsModalVisible(false);
  };

  const renderEditModal = () => (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <Text style={styles.modalSubtitle}>Update your display name</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              maxLength={50}
              editable={!isSaving}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                (!newName.trim() || isSaving) && styles.disabledButton
              ]}
              onPress={handleSaveName}
              disabled={!newName.trim() || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.SECONDARY} />
              ) : (
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.name} numberOfLines={1}>{user.name || 'User'}</Text>
          <Text style={styles.email} numberOfLines={1}>{user.email || 'Email not provided'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
        {/* İkon adı 'edit' olarak değiştirildi */}
        <Icon name="edit" size={22} color="#F7D648" />
      </TouchableOpacity>

      {renderEditModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 8,
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    justifyContent: 'center',
    minHeight: 120,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: Math.max(60, width * 0.15),
    height: Math.max(60, width * 0.15),
    borderRadius: Math.max(30, width * 0.075),
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarText: {
    color: COLORS.SECONDARY,
    fontSize: getResponsiveSize(width, 0.06, 24, 30),
    ...getFontFamily('BOLD'),
  },
  userInfoContainer: {
    marginLeft: Math.max(12, width * 0.03),
    flex: 1,
  },
  name: {
    fontSize: getResponsiveSize(width, 0.045, 18, 22),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(2, width * 0.005),
  },
  email: {
    fontSize: getResponsiveSize(width, 0.032, 13, 16),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
  },
  editButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8
  },
  modalTitle: {
    fontSize: 20,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8
  },
  modalSubtitle: {
    fontSize: 14,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24
  },
  inputContainer: {
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 14,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8
  },
  textInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    ...getFontFamily('REGULAR')
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY
  },
  disabledButton: {
    opacity: 0.5
  },
  modalButtonText: {
    fontSize: 16,
    ...getFontFamily('SEMIBOLD')
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY
  },
  saveButtonText: {
    color: COLORS.SECONDARY
  }
});

export default ProfileHeader;