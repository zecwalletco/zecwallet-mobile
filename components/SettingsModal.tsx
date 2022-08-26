/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, SafeAreaView, Image, Text} from 'react-native';
import {SecondaryButton, RegText, FadeText, BoldText} from './Components';
import {useTheme} from '@react-navigation/native';
import {WalletSettings} from '../app/AppState';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faDotCircle} from '@fortawesome/free-solid-svg-icons';
import {faCircle as farCircle} from '@fortawesome/free-regular-svg-icons';

type SettingsModalProps = {
  closeModal: () => void;
  wallet_settings: WalletSettings;
  set_wallet_option: (name: string, value: string) => void;
};

const SettingsModal: React.FunctionComponent<SettingsModalProps> = ({
  wallet_settings,
  set_wallet_option,
  closeModal,
}) => {
  const {colors} = useTheme();

  const noneIcon = wallet_settings.download_memos === 'none' ? faDotCircle : farCircle;
  const walletIcon = wallet_settings.download_memos === 'wallet' ? faDotCircle : farCircle;
  const allIcon = wallet_settings.download_memos === 'all' ? faDotCircle : farCircle;

  const spam_noneIcon = wallet_settings.spam_filter_threshold === 0 ? faDotCircle : farCircle;
  const spam_allIcon = wallet_settings.spam_filter_threshold > 0 ? faDotCircle : farCircle;

  return (
    <SafeAreaView
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        backgroundColor: colors.background,
      }}>
      <ScrollView
        style={{maxHeight: '85%'}}
        contentContainerStyle={{
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}>
        <View>
          <View style={{alignItems: 'center', backgroundColor: colors.card, paddingBottom: 25}}>
            <Text style={{marginTop: 5, padding: 5, color: colors.text, fontSize: 28}}>Wallet Settings</Text>
          </View>
          <View style={{display: 'flex', alignItems: 'center', marginTop: -25}}>
            <Image
              source={require('../assets/img/logobig.png')}
              style={{width: 50, height: 50, resizeMode: 'contain'}}
            />
          </View>
        </View>

        <View style={{backgroundColor: colors.card, margin: 10, paddingBottom: 10, borderRadius: 15}}>
          <View style={{display: 'flex', margin: 20, borderBottomColor: 'white', borderBottomWidth: 1}}>
            <BoldText>SPAM</BoldText>
          </View>

          <View style={{display: 'flex', marginLeft: 20}}>
            <TouchableOpacity
              style={{marginRight: 10, marginBottom: 10}}
              onPress={() => set_wallet_option('spam_filter_threshold', '50')}>
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <FontAwesomeIcon icon={spam_allIcon} size={20} color={'#ffffff'} />
                <RegText style={{marginLeft: 10}}>Filter out spammy transactions</RegText>
              </View>
            </TouchableOpacity>
            <FadeText>Don't download or try to decrypt spammy transactions.</FadeText>

            <TouchableOpacity
              style={{marginRight: 10, marginBottom: 10}}
              onPress={() => set_wallet_option('spam_filter_threshold', '0')}>
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <FontAwesomeIcon icon={spam_noneIcon} size={20} color={'#ffffff'} />
                <RegText style={{marginLeft: 10}}>No Filtering</RegText>
              </View>
            </TouchableOpacity>
            <FadeText>Download and scan all transactions</FadeText>
          </View>
        </View>

        <View style={{backgroundColor: colors.card, margin: 10, paddingBottom: 10, borderRadius: 15}}>
          <View style={{display: 'flex', margin: 20, borderBottomColor: 'white', borderBottomWidth: 1}}>
            <BoldText>MEMO DOWNLOAD</BoldText>
          </View>

          <View style={{display: 'flex', marginLeft: 20}}>
            <TouchableOpacity
              style={{marginRight: 10, marginBottom: 10}}
              onPress={() => set_wallet_option('download_memos', 'none')}>
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <FontAwesomeIcon icon={noneIcon} size={20} color={'#ffffff'} />
                <RegText style={{marginLeft: 10}}>None</RegText>
              </View>
            </TouchableOpacity>
            <FadeText>Don't download any memos. Server will not learn what transactions belong to you.</FadeText>

            <TouchableOpacity
              style={{marginRight: 10, marginBottom: 10}}
              onPress={() => set_wallet_option('download_memos', 'wallet')}>
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <FontAwesomeIcon icon={walletIcon} size={20} color={'#ffffff'} />
                <RegText style={{marginLeft: 10}}>Wallet</RegText>
              </View>
            </TouchableOpacity>

            <FadeText>
              Download only my memos. Server will learn what TxIDs belong to you, but can't see the addresses, amounts
              or memos
            </FadeText>

            <TouchableOpacity
              style={{marginRight: 10, marginBottom: 10}}
              onPress={() => set_wallet_option('download_memos', 'all')}>
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <FontAwesomeIcon icon={allIcon} size={20} color={'#ffffff'} />
                <RegText style={{marginLeft: 10}}>All</RegText>
              </View>
            </TouchableOpacity>
            <FadeText>
              Download all memos in the blockchain. Server will not learn what TxIDs belong to you. This consumes A LOT
              of bandwidth.
            </FadeText>
          </View>
        </View>
      </ScrollView>

      <View style={{flexGrow: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <SecondaryButton title="Close" style={{marginLeft: 10}} onPress={closeModal} />
      </View>
    </SafeAreaView>
  );
};

export default SettingsModal;
