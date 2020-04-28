import {Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnectivity = () =>
  new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      const handleFirstConnectivityChange = (data) => {
        resolve(data.isConnected);
        NetInfo.removeEventListener(handleFirstConnectivityChange);
      };

      NetInfo.addEventListener(handleFirstConnectivityChange);
    } else {
      NetInfo.fetch().then((data) => {
        resolve(data.isConnected);
      });
    }
  });
