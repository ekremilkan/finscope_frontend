import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFontFamily } from '../../constants/fontConstants';
import { COLORS } from '../../constants/colorConstants';

const { width } = Dimensions.get('window');

const UserCampaignHeader = ({ navigation, campaignCount }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={Math.max(20, Math.min(28, width * 0.06))} color={COLORS.PRIMARY} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Campaigns</Text>
        <Text style={styles.headerSubtitle}>{campaignCount} campaign</Text>
      </View>
 <TouchableOpacity 
        style={styles.empButton}
        
      >
        
      </TouchableOpacity>
      {/* <View style={styles.headerRight}>
        <Icon name="campaign" size={Math.max(20, Math.min(28, width * 0.06))} color={COLORS.PRIMARY} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SECONDARY,
    minHeight: Math.max(70, width * 0.18),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
  },
   empButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Math.max(16, width * 0.04),
  },
  logoContainer: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    marginBottom: Math.max(8, width * 0.02),
    borderRadius: Math.max(6, width * 0.015),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  logo: {
    width: Math.max(24, width * 0.06),
    height: Math.max(24, width * 0.06),
  },
  headerTitle: {
    fontSize: Math.max(16, Math.min(22, width * 0.055)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    textShadowColor: 'rgba(247, 214, 72, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: Math.max(12, Math.min(16, width * 0.035)),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
    textAlign: 'center',
  },
  headerRight: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserCampaignHeader;
