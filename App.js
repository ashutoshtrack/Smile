import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
} from 'react-native';

const BASE_API = 'http://test.chatongo.in/testdata.json';
const LOCAL_STORE_NAME = 'DETAILS';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {checkNetworkConnectivity} from './urtils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.pageLoadHandler();
  }

  /*
 Loads data from network if online or goes to async storage  to retrieve
*/
  pageLoadHandler = () => {
    checkNetworkConnectivity().then((check) => {
      if (check) {
        this.fetchData();
      } else {
        this.getLocalData();
      }
    });
  };
  //Fetches from local store, used async for now
  getLocalData = async () => {
    let data = await AsyncStorage.getItem(LOCAL_STORE_NAME);
    if (data) {
      this.setState({records: JSON.parse(data), isLoading: false});
    } else {
      this.setState({isLoading: false});
    }
  };

  //Fetches data from network, sets data to local once rendered
  fetchData = async () => {
    try {
      let response = await axios.get(BASE_API);

      if (response.data && response.data.data) {
        this.setState(
          {
            isLoading: false,
            records: response.data.data.Records,
          },
          () => {
            AsyncStorage.setItem(
              LOCAL_STORE_NAME,
              JSON.stringify(response.data.data.Records),
            );
          },
        );
      }
    } catch (e) {
      console.debug(e);
      this.setState({isLoading: false});
    }
  };

  /*
Image component in react-native retreives from URi internally if not present  or takes from cache 
did tested multiple times from offline 
*/
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{padding: 10, backgroundColor: '#000'}}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            Record List
          </Text>
        </View>

        {this.state.isLoading ? (
          <View style={styles.acitivityStyle}>
            <ActivityIndicator size={80} color={'#fff'} />
          </View>
        ) : (
          <FlatList
            data={this.state.records}
            renderItem={({item}) => (
              <View style={styles.recordContainer}>
                <View style={styles.imageContainer}>
                  <ImageBackground
                    style={{
                      width: '100%',
                      height: '100%',
                      flex: 1,
                    }}
                    resizeMode="cover"
                    source={require('./resources/place.png')}>
                    <Image
                      source={{
                        uri: item.mainImageURL,
                      }}
                      style={{width: '100%', height: '100%'}}></Image>
                  </ImageBackground>
                </View>
                <View style={[styles.row, styles.overlay, {padding: 10}]}>
                  <View style={[styles.card, styles.row]}>
                    <View style={{width: '90%', alignItems: 'flex-start'}}>
                      <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                        {item.title}
                      </Text>
                      <Text style={{marginTop: 5}}>
                        {item.shortDescription}
                      </Text>
                    </View>
                    <View style={{width: '10%', alignItems: 'flex-end'}}>
                      <FontAwesomeIcon icon={faHeart} color="red" />
                    </View>
                  </View>

                  <View style={styles.percentCard}>
                    <Text style={[styles.percentText]}>100%</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.listInfoColumn}>
                    <Text style={{fontWeight: 'bold', color: '#fff'}}>
                      <Text style={{fontSize: 18}}>&#8377;</Text>
                      {item.collectedValue}
                    </Text>
                    <Text style={{color: '#fff'}}>Funded</Text>
                  </View>
                  <View style={styles.listInfoColumn}>
                    <Text style={{fontWeight: 'bold', color: '#fff'}}>
                      <Text style={{fontSize: 18}}>&#8377;</Text>
                      {item.totalValue}
                    </Text>
                    <Text style={{color: '#fff'}}>Goals</Text>
                  </View>
                  <View style={styles.listInfoColumn}>
                    <Text style={{fontWeight: 'bold', color: '#fff'}}>
                      <Text style={{fontSize: 18}}></Text>
                      {item.endDate}
                    </Text>
                    <Text style={{color: '#fff'}}>Ends In</Text>
                  </View>
                  <View style={styles.listInfoColumn}>
                    <TouchableOpacity style={styles.button}>
                      <Text style={{fontWeight: 'bold', color: '#367588'}}>
                        PLEDGE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyRecordDisplay}>
                <Text style={styles.displayStyle}>No records to display</Text>
                <Text style={styles.displayStyle}>
                  Please check your internet and try again.
                </Text>
              </View>
            )}
            keyExtractor={({item}, index) => index.toString()}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#367588',
  },
  acitivityStyle: {
    flex: 1,
    backgroundColor: '#367588',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayStyle: {fontSize: 18, color: 'white'},
  emptyRecordDisplay: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },
  recordContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#367588',
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  listInfoColumn: {
    alignItems: 'center',
    width: '25%',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    width: '70%',
    height: 'auto',
    borderRadius: 10,
  },
  percentCard: {
    width: '30%',
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  percentText: {
    backgroundColor: '#104e61',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 50,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  overlay: {
    zIndex: 10,
    marginTop: -60,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
