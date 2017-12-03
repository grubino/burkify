import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Camera, Permissions, KeepAwake} from 'expo';

class Burkified extends React.Component {
  static styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'hidden',
    }
  });
  render() {
    const params = this.props.navigation.state.params;
    return (
      <View style={Burkified.styles.container}>
        <Image source={{uri: params.image.uri}} style={{height: '100%', width: '100%'}}/>
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
  buttonSize = 50;
  buttonStyle = {
    padding: 5,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#aaa',
    borderRadius: this.buttonSize / 2,
    margin: 10
  };

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
                <View style={this.buttonStyle}>
                  <Image style={{
                    width: this.buttonSize,
                    height: this.buttonSize,
                  }}
                         source={require('./assets/camera_flip.png')}/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  this.camera.takePictureAsync().then(img => {
                    this.props.navigation.navigate('Burkified', {image: img});
                  });
                }}>
                <View style={this.buttonStyle}>
                  <Image style={{
                    width: this.buttonSize,
                    height: this.buttonSize,
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

