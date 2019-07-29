import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'

import { Card, Badge, Button, Block, Text } from '../components';
import { theme } from '../constants';

const { width } = Dimensions.get('window');

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateForms } from '../actions/./functions'

const axios = require('axios');

class Browse extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      active: 'Forms',
      refreshing: false
    }
    this.getForms()
  }

  getForms = () => {
    axios({
      method: 'get',
      url: 'http://api.jotform.com/user/forms',
      headers: {
        'Accept': 'application/json',
      },
      params: { apiKey: this.props.store.jotapi }
    })
      .then(this.handleSuccess)
      .catch(this.handleError)
  }

  handleSuccess = (response) => {
    let content = response.data.content
    this.props.updateForms(content)
    this.setState({ refreshing: false })
  }

  handleError = (error) => {
    console.log(error.response.data)
  }

  renderTab(tab) {
    const { active } = this.state;
    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        style={[
          styles.tab,
          isActive ? styles.active : null
        ]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigation } = this.props;
    const tabs = ['Forms'];

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Home</Text>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={{ uri: 'http://s3.amazonaws.com/jotformAvatars/4467443737/photo.jpg' }}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <Block flex={false} row style={styles.tabs}>
          {tabs.map(tab => this.renderTab(tab))}
        </Block>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getForms()}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2 }}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {this.props.store.forms.map(form => (
              form.status !== 'DELETED' ?
                <TouchableOpacity
                  key={form.id}
                  onPress={() => navigation.navigate('Form', { title: form.title, item: form })}
                >
                  <Card middle shadow style={styles.category}>
                    <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                      <Image source={require('../assets/images/form.png')} style={{ width: 70, height: 70 }} />
                    </Badge>
                    <Text medium height={20}>{form.title}</Text>
                    <Text gray caption>{form.count === 0 ? 'No submission has made.' : form.count + ' submissions made.'}</Text>
                  </Card>
                </TouchableOpacity> : null
            ))}
          </Block>
        </ScrollView>
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
    borderRadius: 17.6
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateForms
  }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    store: state.storage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Browse)