//multi wallet bağlantısnda bağlı cüzdanların kopmaması, güvenlik iççn imza olması lazım
//etherium yazan kısmı diğer ağlara göre dinamik hale getirmek lazım
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, BackHandler, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_STORAGE_KEY = '@connected_wallets';
const MAX_WALLETS = 3;

const WalletScreen = ({ navigation }) => {
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  // Kayıtlı cüzdanları yükle
  useEffect(() => {
    loadSavedWallets();
  }, []);

  // Android geri tuşu için handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const loadSavedWallets = async () => {
    try {
      const savedWallets = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
      if (savedWallets) {
        const wallets = JSON.parse(savedWallets);
        setConnectedWallets(wallets);
        console.log('Saved wallets loaded:', wallets.length);
      }
    } catch (error) {
      console.error('Failed to load saved wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWallets = async (wallets) => {
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
      console.log('Wallets saved successfully');
    } catch (error) {
      console.error('Failed to save wallets:', error);
    }
  };

  const handleBackPress = () => {
    // WebView'da geri gitme işlemi
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // Android'de varsayılan geri işlemini engelle
    }
    return false;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);

      switch (data.type) {
        case 'WALLET_CONNECTED':
          handleWalletConnected(data);
          break;
          
        case 'WALLET_DISCONNECTED':
          handleWalletDisconnected(data);
          break;
          
        case 'ADD_NEW_WALLET_REQUEST':
          handleAddNewWalletRequest(data);
          break;

        case 'WALLET_SWITCH_REQUEST':
          handleWalletSwitchRequest(data);
          break;

        case 'GET_CONNECTED_WALLETS':
          sendConnectedWalletsToWebView();
          break;

        case 'TRANSACTION_SIGN_REQUEST':
          handleTransactionSignRequest(data);
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView:', error);
    }
  };

  const handleWalletConnected = async (data) => {
    const { address, chainId, chainName, walletType = 'Unknown', balance } = data;

    // Aynı adres zaten bağlı mı kontrol et
    const isAlreadyConnected = connectedWallets.some(wallet => 
      wallet.address.toLowerCase() === address.toLowerCase()
    );

    if (isAlreadyConnected) {
      Alert.alert(
        'Wallet Already Connected',
        'This wallet is already connected to your account.',
        [{ text: 'OK' }]
      );
      return;
    }

    const newWallet = {
      id: Date.now().toString(),
      address,
      chainId,
      chainName: chainName || 'Unknown Chain',
      walletType,
      balance: balance || '0',
      connectedAt: new Date().toISOString(),
      isActive: connectedWallets.length === 0 // İlk cüzdan aktif olsun
    };

    const updatedWallets = [...connectedWallets, newWallet];
    setConnectedWallets(updatedWallets);
    await saveWallets(updatedWallets);

    console.log('Wallet connected ✅');
    console.log('Address:', address);
    console.log('Chain ID:', chainId);
    console.log('Chain Name:', chainName);

    Alert.alert(
      'Wallet Connected Successfully! 🎉',
      `${walletType} wallet connected\n\nAddress: ${address.slice(0, 6)}...${address.slice(-4)}\nChain: ${chainName || 'Unknown'}\nBalance: ${balance || 'N/A'}`,
      [
        {
          text: 'View Wallets',
          onPress: () => showConnectedWallets()
        },
        { 
          text: 'Continue', 
          style: 'default' 
        }
      ]
    );

    // WebView'a başarılı bağlantı mesajı gönder
    sendMessageToWebView({
      type: 'WALLET_CONNECTION_SUCCESS',
      walletCount: updatedWallets.length
    });
  };

  const handleWalletDisconnected = async (data) => {
    // Eğer data veya address yoksa, fonksiyondan çık
    if (!data || !data.address) {
        return;
    }

    const { address } = data;
    
    // Belirli cüzdanı kaldır
    const updatedWallets = connectedWallets.filter(
        wallet => wallet.address.toLowerCase() !== address.toLowerCase()
    );
    
    setConnectedWallets(updatedWallets);
    await saveWallets(updatedWallets);

    console.log('Wallet disconnected ❌');

    Alert.alert(
        'Wallet Disconnected',
        `Wallet ${address.slice(0, 6)}...${address.slice(-4)} has been disconnected.`,
        [{ text: 'OK', style: 'default' }]
    );
  };

  const handleAddNewWalletRequest = (data) => {
    const { currentAddress, currentChain, currentChainId } = data;
    
    if (connectedWallets.length >= MAX_WALLETS) {
      Alert.alert(
        'Maximum Wallets Reached',
        `You can only connect up to ${MAX_WALLETS} wallets. Please disconnect one of your existing wallets first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('Add new wallet requested 🆕');
    console.log('Current connected wallets:', connectedWallets.length);

    Alert.alert(
      'Add New Wallet',
      `Do you want to add a new wallet?\n\nCurrent wallets: ${connectedWallets.length}/${MAX_WALLETS}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            sendMessageToWebView({
              type: 'ADD_WALLET_CANCELLED'
            });
          }
        },
        {
          text: 'Add Wallet',
          style: 'default',
          onPress: () => {
            console.log('User confirmed adding new wallet');
            
            sendMessageToWebView({
              type: 'PROCEED_ADD_WALLET',
              confirmed: true,
              maxWallets: MAX_WALLETS,
              currentCount: connectedWallets.length
            });
            
            Alert.alert(
              'Adding Wallet...',
              'Please follow the wallet connection process.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleWalletSwitchRequest = async (data) => {
    const { targetAddress } = data;
    
    // Aktif cüzdanı değiştir
    const updatedWallets = connectedWallets.map(wallet => ({
      ...wallet,
      isActive: wallet.address.toLowerCase() === targetAddress.toLowerCase()
    }));

    setConnectedWallets(updatedWallets);
    await saveWallets(updatedWallets);

    const activeWallet = updatedWallets.find(w => w.isActive);
    
    Alert.alert(
      'Wallet Switched',
      `Active wallet: ${activeWallet?.address.slice(0, 6)}...${activeWallet?.address.slice(-4)}`,
      [{ text: 'OK' }]
    );
  };

  const handleTransactionSignRequest = (data) => {
    const { transaction, from, to, value, gasLimit } = data;
    
    Alert.alert(
      'Sign Transaction',
      `From: ${from?.slice(0, 6)}...${from?.slice(-4)}\nTo: ${to?.slice(0, 6)}...${to?.slice(-4)}\nValue: ${value} ETH\nGas Limit: ${gasLimit}`,
      [
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            sendMessageToWebView({
              type: 'TRANSACTION_REJECTED',
              transactionId: data.transactionId
            });
          }
        },
        {
          text: 'Sign',
          onPress: () => {
            sendMessageToWebView({
              type: 'TRANSACTION_APPROVED',
              transactionId: data.transactionId
            });
          }
        }
      ]
    );
  };

  const sendConnectedWalletsToWebView = () => {
    sendMessageToWebView({
      type: 'CONNECTED_WALLETS_DATA',
      wallets: connectedWallets,
      maxWallets: MAX_WALLETS
    });
  };

  const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  const showConnectedWallets = () => {
    if (connectedWallets.length === 0) {
      Alert.alert('No Wallets', 'No wallets are currently connected.');
      return;
    }

    const walletList = connectedWallets.map((wallet, index) => 
      `${index + 1}. ${wallet.walletType}\n   ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}\n   Chain: ${wallet.chainName}${wallet.isActive ? ' (Active)' : ''}`
    ).join('\n\n');

    Alert.alert(
      `Connected Wallets (${connectedWallets.length}/${MAX_WALLETS})`,
      walletList,
      [{ text: 'OK' }]
    );
  };

  const handleWebViewLoad = () => {
    setIsLoading(false);
    
    // WebView yüklendiğinde mevcut cüzdanları gönder
    setTimeout(() => {
      sendConnectedWalletsToWebView();
    }, 1000);
  };

  const handleWebViewError = (error) => {
    console.error('WebView error details:', {
      description: error.description,
      domain: error.domain,
      code: error.code,
      nativeEvent: error.nativeEvent
    });
    
    Alert.alert(
      'Connection Error',
      `Failed to connect to MetaMask. Error: ${error.description || 'Unknown error'}. Please try again.`,
      [
        {
          text: 'Retry',
          onPress: () => webViewRef.current?.reload()
        },
        {
          text: 'Go Back',
          onPress: () => navigation?.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'http://localhost:5173/wallet' }}
        // iOS için: source={{ uri: 'http://192.168.1.105:5173' }}
        // Production için kendi domain'inizi kullanın
        originWhitelist={['*']}
        onMessage={handleWebViewMessage}
        onLoad={handleWebViewLoad}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={!isLoading}
        style={styles.webview}
        
        // WebView gelişmiş ayarları
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        
        // Güvenlik ayarları
        allowsBackForwardNavigationGestures
        // decelerationRate="normal"
        
        // Hata yönetimi
        onError={handleWebViewError}
        onHttpError={(error) => {
          console.error('WebView HTTP error:', error.nativeEvent);
        }}
        
        // Loading state
        renderLoading={() => null}
        
        // User agent (opsiyonel)
        userAgent="WalletApp/1.0 (Mobile)"
        
        // İnjected JavaScript (WebView yüklendiğinde çalışır)
        injectedJavaScript={`
          // MetaMask kontrolü
          if (typeof window.ethereum === 'undefined') {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ERROR',
              message: 'MetaMask not detected'
            }));
          }
          
          // React Native'den mesaj dinle
          window.addEventListener('message', function(event) {
            console.log('Message from React Native:', event.data);
          });
          
          // Sayfa yüklendiğinde React Native'e bildir
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'WEBVIEW_LOADED',
            timestamp: Date.now()
          }));
          
          true; // Bu satır önemli!
        `}
        mixedContentMode="always"
        allowsProtectedMedia={true}
        androidLayerType="hardware"
        cacheEnabled={false}
        onShouldStartLoadWithRequest={(request) => {
          // MetaMask deep linking için
          if (request.url.startsWith('metamask://')) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});