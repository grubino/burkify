import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Camera, Permissions, KeepAwake, FileSystem, takeSnapshotAsync} from 'expo';

const buttonSize = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  }, image: {
    position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
  }, buttonStyle: {
    padding: 5,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#aaa',
    borderRadius: buttonSize / 2,
    margin: 10
  }, buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});

class Burkified extends React.Component {
  burkifiedView = null;
  state = {
    burkifiedUri: null
  };

  render() {
    const params = this.props.navigation.state.params;
    const overlays = params.overlays;
    return (
      <View ref={ref => this.burkifiedView = ref} style={styles.container}>
        <Image style={styles.image} source={params.image}/>
        {overlays.map((img, i) => <Image key={i} style={img.style} source={img.image}/>)}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => {
              const data = await takeSnapshotAsync(this.burkifiedView, {format: 'png'});
              FileSystem.moveAsync({
                from: data,
                to: `${FileSystem.documentDirectory}Burkified.png`
              }).then(() => alert(`Saved to ${FileSystem.documentDirectory}!`)).catch(err => alert(JSON.stringify(err)));
            }}>
            <View style={styles.buttonStyle}>
              <Image style={{
                width: buttonSize,
                height: buttonSize,
              }} source={require('./assets/save_icon.png')}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Home extends React.Component {
  static navigationOptions = {
    title: 'Burkify'
  };
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    image: null,
  };
  camera = null;

  async componentWillMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <KeepAwake/>
          <Camera ref={ref => this.camera = ref} style={{flex: 1}} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <View style={styles.buttonStyle}>
                  <Image style={{
                    width: buttonSize,
                    height: buttonSize,
                  }}
                         source={require('./assets/camera_flip.png')}/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  this.camera.takePictureAsync().then(img => {
                    this.props.navigation.navigate('Burkified',
                      {image: img, overlays: [
                        {
                          image: require('./assets/burka.png'),
                          style: {position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}
                        },
                        {
                          image: require('./assets/marxify.png'),
                          style: {
                            overflow: 'visible',
                            position: 'absolute',
                            top: '8%',
                            left: '45%',
                            width: '20%',
                            height: '20%'
                          }
                        }]
                      });
                  });
                }}>
                <View style={styles.buttonStyle}>
                  <Image style={{
                    width: buttonSize,
                    height: buttonSize,
                  }} source={require('./assets/burka.png')}/>
                </View>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default App = StackNavigator({
  Home: {
    screen: Home
  }, Burkified: {
    screen: Burkified
  }
});

