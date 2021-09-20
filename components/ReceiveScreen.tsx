/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Dimensions, Clipboard, Platform, Image, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {TabView, TabBar} from 'react-native-tab-view';
import Toast from 'react-native-simple-toast';
import {ClickableText, FadeText, SecondaryButton} from '../components/Components';
import {Info} from '../app/AppState';
import Utils from '../app/utils';
import {useTheme} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import OptionsMenu from 'react-native-option-menu';
import RPC from '../app/rpc';

type SingleAddress = {
  addresses: string[] | null;
  displayAddress: string;
};

const SingleAddressDisplay: React.FunctionComponent<SingleAddress> = ({addresses, displayAddress}) => {
  let [currentAddressIndex, setCurrentAddressIndex] = useState(0);

  let address = 'No Address';
  if (addresses && addresses.length > 0 && currentAddressIndex < addresses.length) {
    address = addresses[currentAddressIndex];
  }

  const multipleAddresses = addresses && addresses.length > 1;
  // console.log(`Addresses ${addresses}: ${multipleAddresses}`);
  const {colors} = useTheme();

  if (addresses) {
    let displayAddressIndex = addresses?.findIndex(a => a === displayAddress);

    if (currentAddressIndex !== displayAddressIndex && displayAddressIndex >= 0) {
      setCurrentAddressIndex(displayAddressIndex);
    }
  }

  const chunks = Utils.splitAddressIntoChunks(address, Utils.isSapling(address) ? 4 : 2);
  const fixedWidthFont = Platform.OS === 'android' ? 'monospace' : 'Courier';

  const doCopy = () => {
    if (address) {
      Clipboard.setString(address);
      Toast.show('Copied Address to Clipboard', Toast.LONG);
    }
  };

  const prev = () => {
    if (addresses) {
      let newIndex = currentAddressIndex - 1;
      if (newIndex < 0) {
        newIndex = addresses?.length - 1;
      }
      setCurrentAddressIndex(newIndex);
    }
  };

  const next = () => {
    if (addresses) {
      const newIndex = (currentAddressIndex + 1) % addresses?.length;
      setCurrentAddressIndex(newIndex);
    }
  };

  return (
    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <FadeText style={{marginTop: 20}}>m/0'/0'/{currentAddressIndex}</FadeText>
      <View style={{padding: 10, backgroundColor: 'rgb(255, 255, 255)', marginTop: 5}}>
        <QRCode value={address} size={250} ecl="M" />
      </View>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center'}}>
        {chunks.map(c => (
          <FadeText
            key={c}
            style={{
              flexBasis: '100%',
              textAlign: 'center',
              fontFamily: fixedWidthFont,
              fontSize: 18,
              color: colors.text,
            }}>
            {c}
          </FadeText>
        ))}
      </View>
      <ClickableText style={{marginTop: 10}} onPress={doCopy}>
        Tap To Copy
      </ClickableText>

      {multipleAddresses && (
        <View style={{display: 'flex', flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <SecondaryButton title={'Prev'} style={{width: '25%', margin: 10}} onPress={prev} />
          <SecondaryButton title={'Next'} style={{width: '25%', margin: 10}} onPress={next} />
        </View>
      )}
    </View>
  );
};

type ReceiveScreenProps = {
  info: Info | null;
  addresses: string[];
  toggleMenuDrawer: () => void;
  fetchTotalBalance: () => Promise<void>;
};

const ReceiveScreen: React.FunctionComponent<ReceiveScreenProps> = ({
  addresses,
  toggleMenuDrawer,
  fetchTotalBalance,
}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'zaddr', title: 'Z Address'},
    {key: 'taddr', title: 'T Address'},
  ]);

  const [displayAddress, setDisplayAddress] = useState('');

  const {colors} = useTheme();

  const zaddrs = addresses.filter(a => Utils.isSapling(a)) || null;
  const taddrs = addresses.filter(a => Utils.isTransparent(a)) || null;

  const MoreIcon = require('../assets/img/more.png');

  const renderScene: (routes: any) => JSX.Element | undefined = ({route}) => {
    switch (route.key) {
      case 'zaddr':
        return <SingleAddressDisplay addresses={zaddrs} displayAddress={displayAddress} />;
      case 'taddr':
        return <SingleAddressDisplay addresses={taddrs} displayAddress={displayAddress} />;
    }
  };

  const addZ = async () => {
    console.log('New Z');
    const newAddress = await RPC.createNewAddress(true);
    await fetchTotalBalance();
    setIndex(0);
    setDisplayAddress(newAddress);
  };

  const addT = async () => {
    console.log('New T');
    const newAddress = await RPC.createNewAddress(false);
    await fetchTotalBalance();
    setIndex(1);
    setDisplayAddress(newAddress);
  };

  const renderTabBar: (props: any) => JSX.Element = props => (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'space-between',
          backgroundColor: colors.card,
          paddingBottom: 25,
          paddingLeft: 100,
          zIndex: -1,
        }}>
        <Text style={{marginTop: 5, padding: 5, color: colors.text, fontSize: 28}}>Wallet Address</Text>
        <OptionsMenu
          button={MoreIcon}
          buttonStyle={{width: 32, height: 32, margin: 7.5, resizeMode: 'contain'}}
          destructiveIndex={1}
          options={['Add Z Address', 'Add T Address', 'Cancel']}
          actions={[addZ, addT]}
        />
      </View>

      <View style={{backgroundColor: '#353535', padding: 10, position: 'absolute'}}>
        <TouchableOpacity onPress={toggleMenuDrawer}>
          <FontAwesomeIcon icon={faBars} size={20} color={'#ffffff'} />
        </TouchableOpacity>
      </View>

      <View style={{display: 'flex', alignItems: 'center', marginTop: -25}}>
        <Image source={require('../assets/img/logobig.png')} style={{width: 50, height: 50, resizeMode: 'contain'}} />
      </View>
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: colors.primary}}
        style={{backgroundColor: colors.background}}
      />
    </View>
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{width: Dimensions.get('window').width}}
    />
  );
};

export default ReceiveScreen;
