import React from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'

import Navigation from './navigation';
import { Block } from './components';

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import storageReducer from './reducers/./storage'

const images = [
  require('./assets/images/illustration_1.png'),
  require('./assets/images/form.png')
];

const store = createStore(storageReducer)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  handleResourcesAsync = async () => {
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.handleResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      )
    }

    return (
      <Provider store={store}>
        <Block white>
        <Navigation />
        </Block>
      </Provider>
    );
  }
}
