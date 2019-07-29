import React, { Component } from 'react'
import { Animated, Dimensions, Image, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';

import { Button, Block, Text } from '../components';
import { theme } from '../constants';

import { connect } from 'react-redux'

const { width, height } = Dimensions.get('window');

class Welcome extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.props.navigation.navigate(this.props.store.jotapi !== '' ? 'Browse' : '');
  }

  state = {
    showTerms: false,
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block>
        <Block center bottom flex={0.6}>
          <Text h1 center bold>
            <Text h1 primary>JotForm</Text> Data Generator

        </Text>
          <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
            Mock data generator for your forms.
        </Text>
        </Block>
        <Block center middle>
          <Image
            source={require('../assets/images/illustration_1.png')}
            resizeMode="contain"
            style={styles.illustrations}
          />
        </Block>
        <Block top flex={0.55} margin={[0, theme.sizes.padding * 2]}>
          <Button gradient onPress={() => navigation.navigate('Login')}>
            <Text center semibold white>Login with JotForm account</Text>
          </Button>
        </Block>
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  illustrations: {
    width: width - 80,
    marginLeft: 40,
    marginRight: 40,
    height: height / 2,
    overflow: 'visible'
  }
})

const mapStateToProps = (state) => {
  return {
    store: state.storage
  }
}

export default connect(mapStateToProps, null)(Welcome)