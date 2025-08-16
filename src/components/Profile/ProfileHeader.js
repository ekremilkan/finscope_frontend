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
import {
  getGlassMorphismStyle,
  getResponsiveSize,
  getUserAvatar,
  formatJoinDate
} from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ProfileHeader = ({ user, onEditPress, onNameUpdate, isLoading = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPress = () => {
    setNewName(user?.name || '');
    setIsModalVisible(true);
    if (onEditPress) onEditPress();
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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{getUserAvatar(user.name)}</Text>
      </View>

      <Text style={styles.name}>{user.name || 'User'}</Text>
      <Text style={styles.email}>{user.email || 'Email not provided'}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
        <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
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
    alignItems: 'center',
    paddingVertical: Math.max(20, width * 0.05),
    paddingHorizontal: Math.max(20, width * 0.05),
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Math.max(12, width * 0.03)
  },
  avatar: {
    fontSize: getResponsiveSize(width, 0.15, 48, 80),
    textAlign: 'center',
    backgroundColor: COLORS.PRIMARY,
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    textAlignVertical: 'center',
    lineHeight: Math.max(80, width * 0.2),
    color: COLORS.SECONDARY,
    ...getFontFamily('BOLD')
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(40, width * 0.1)
  },
  loadingText: {
    fontSize: getResponsiveSize(width, 0.04, 16, 20),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY
  },
  name: {
    fontSize: getResponsiveSize(width, 0.06, 24, 32),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(4, width * 0.01),
    textAlign: 'center'
  },
  email: {
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: Math.max(12, width * 0.03),
    textAlign: 'center'
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(10, width * 0.025),
    borderRadius: 8,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  editButtonText: {
    color: COLORS.SECONDARY,
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    ...getFontFamily('SEMIBOLD')
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
