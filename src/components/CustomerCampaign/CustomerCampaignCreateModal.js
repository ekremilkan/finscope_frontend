import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const CustomerCampaignCreateModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  categories, 
  difficulties 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    maxParticipants: '',
    category: 'education',
    difficulty: 'Beginner',
    duration: '',
    questions: '',
    passRate: '70',
    tags: []
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.reward) {
      Alert.alert('Error', 'Please fill in required fields.');
      return;
    }

    const processedData = {
      ...formData,
      reward: parseInt(formData.reward),
      maxParticipants: parseInt(formData.maxParticipants) || 100,
      questions: parseInt(formData.questions) || 5,
      passRate: parseInt(formData.passRate),
      tags: formData.tags.length > 0 ? formData.tags : [formData.category]
    };

    onSubmit(processedData);
    resetForm();
    Alert.alert('Success', 'Campaign created successfully!');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reward: '',
      maxParticipants: '',
      category: 'education',
      difficulty: 'Beginner',
      duration: '',
      questions: '',
      passRate: '70',
      tags: []
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.createModal}>
          {/* Fixed Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Campaign</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.modalContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Campaign Title *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter campaign title"
                placeholderTextColor="#94a3b8"
                value={formData.title}
                onChangeText={(text) => updateFormData('title', text)}
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter campaign description"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Reward (USDT) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={formData.reward}
                  onChangeText={(text) => updateFormData('reward', text)}
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Max Participants</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="100"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={formData.maxParticipants}
                  onChangeText={(text) => updateFormData('maxParticipants', text)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.pickerContainer}>
                {categories && categories.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.pickerOption,
                      formData.category === category.id && styles.selectedOption
                    ]}
                    onPress={() => updateFormData('category', category.id)}
                  >
                    <Text style={[
                      styles.pickerText,
                      formData.category === category.id && styles.selectedText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Difficulty Level</Text>
              <View style={styles.pickerContainer}>
                {difficulties && difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.pickerOption,
                      formData.difficulty === difficulty && styles.selectedOption
                    ]}
                    onPress={() => updateFormData('difficulty', difficulty)}
                  >
                    <Text style={[
                      styles.pickerText,
                      formData.difficulty === difficulty && styles.selectedText
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Duration</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="5 days"
                  placeholderTextColor="#94a3b8"
                  value={formData.duration}
                  onChangeText={(text) => updateFormData('duration', text)}
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Number of Questions</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="5"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={formData.questions}
                  onChangeText={(text) => updateFormData('questions', text)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Pass Score (%)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="70"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={formData.passRate}
                onChangeText={(text) => updateFormData('passRate', text)}
              />
            </View>

            {/* Bottom spacing for keyboard */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Fixed Bottom Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.createButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center', // Center modal
    paddingVertical: Math.max(40, height * 0.05), // Top and bottom spacing
  },
  createModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
    marginHorizontal: Math.max(20, width * 0.05),
    borderRadius: 24,
    maxHeight: height * 0.9, // Maximum height
    minHeight: height * 0.6, // Minimum height
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(20, width * 0.05),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  modalTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formLabel: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Math.max(12, width * 0.03),
    fontSize: Math.max(16, width * 0.04),
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    minHeight: Math.max(48, width * 0.12),
  },
  textArea: {
    minHeight: Math.max(100, width * 0.25),
    maxHeight: Math.max(150, width * 0.38),
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  selectedOption: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  pickerText: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.9)',
    fontWeight: '500',
  },
  selectedText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40, // Extra space for keyboard
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(20, width * 0.05),
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    gap: 12,
    backgroundColor: 'rgba(30, 41, 59, 1)', // Solid background
  },
  modalButton: {
    flex: 1,
    paddingVertical: Math.max(14, width * 0.035),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Math.max(48, width * 0.12),
  },
  cancelButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  createButton: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButtonText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ffffff',
  },
  createButtonText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default CustomerCampaignCreateModal; 