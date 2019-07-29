import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateUsername, updatePassword, updateJotApi, updatePhoto } from '../actions/./functions'

const axios = require('axios');

class Login extends Component {
    state = {
      loading: false
    }

  handleSuccess = (response) => {
    console.log(response);
    this.props.updateJotApi(response.data.content.appKey)
    this.setState({ loading: false })
    this.props.navigation.navigate('Browse');
  }

  handleError = (error) => {
    const err = error.response.data.responseCode
    var result = ''
    if (err === 401) {
      result = 'Your credentials are wrong. You are not authorized.'
    } else if (err === 402) {
      result = 'An unknown error has occured.'
    } else if (err === 403) {
      result = 'You have made so many login attempts. Please try again later.'
    }

    Alert.alert(
      'Something went wrong.',
      result,
      [
        {text: 'OK'},
        {
          text: 'Cancel',
          style: 'cancel'}
      ],
      {cancelable: false},
    );


    this.setState({ loading: false })
  }

  handleLogin() {
    Keyboard.dismiss();
    this.setState({ loading: true });

    const { username, password } = this.props.store;
    const { navigation } = this.props;
    
    axios({
      method: 'post',
      url: 'https://api.jotform.com/login',
      headers: {
        'Accept': 'application/json',
      },
      params: { username: username, password: password, appName: 'jot-api' }
    })
    .then(this.handleSuccess)
    .catch(this.handleError)
  }

  render() {
    const { error } = '';
    const hasError = key => error !== '' ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[80, theme.sizes.base * 3]}>
          <Text h1 bold>Login</Text>
          <Block middle flex={0.9}>
            <Input
              label="Username"
              error={hasError('username')}
              style={[styles.input, hasError('username')]}
              onChangeText={text => this.props.updateUsername(text)}
            />
            <Input
              secure
              label="Password"
              error={hasError('password')}
              style={[styles.input, hasError('password')]}
              onChangeText={text => this.props.updatePassword(text)}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {this.state.loading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>Login</Text>
              }
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUsername,
    updatePassword,
    updateJotApi,
    updatePhoto
  }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    store: state.storage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)