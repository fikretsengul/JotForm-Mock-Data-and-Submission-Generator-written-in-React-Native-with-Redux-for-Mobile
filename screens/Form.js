import React, { Component } from 'react';
import { Dimensions, StyleSheet, Alert } from 'react-native';

import { Button, Divider, Input, Block, Text, Card } from '../components';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import Dialog, { DialogFooter, DialogTitle, DialogButton, DialogContent } from 'react-native-popup-dialog';
import { CustomPicker } from 'react-native-custom-picker'

const axios = require('axios');

class Form extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', null) + ' Details',
    };
  };

  constructor(props) {
    super(props)
    form = this.props.navigation.getParam('item', null)
    this.state = {
      nofrows: 0,
      fields: [],
      others: [],
      flag: "",
      wait: false,
      defaultAnimationDialog: false
    }
    this.getFormQuestions()
  }

  handleError = (error) => {
    console.log(error.response)
  }

  handleRecords = (records) => {

    for (const key in records.data) {
      const fields = this.state.fields
      var choices = []
      var foundIndex = this.state.fields.findIndex(x => x.name == key);

      if (fields[foundIndex].name === 'control_dropdown') {
        choices = this.state.others[0].split('|')
        this.setState(state => {
          const fields = state.fields;
          fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
          return { fields }
        })
      } else if (fields[foundIndex].name === 'control_radio') {
        choices = this.state.others[1].split('|')
        this.setState(state => {
          const fields = state.fields;
          fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
          return { fields }
        })
      } else if (fields[foundIndex].name === 'control_checkbox') {
        choices = this.state.others[2].split('|')
        this.setState(state => {
          const fields = state.fields;
          fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
          return { fields }
        })
      } else {
        this.setState(state => {
          const fields = state.fields;
          fields[foundIndex].value = records.data[key]
          return { fields }
        })
      }
    }

    if (this.state.flag === "send") {
      this.postFormSubmission()
      this.setState({ nofrows: this.state.nofrows - 1 })

      if (this.state.nofrows === 0) {
        this.setState({ flag: "" })
        this.setState({ wait: false })
      } else {
        this.getRandomRecords()
      }
    }

  }

  getFormQuestions() {
    axios({
      method: 'get',
      url: 'http://api.jotform.com/form/' + form.id + '/questions',
      headers: {
        'Accept': 'application/json'
      },
      params: {
        apiKey: this.props.store.jotapi
      }
    })
      .then(this.handleFields)
      .catch(this.handleError)
  }

  handleFields = (questions) => {
    const question = questions.data.content

    this.setState(state => {
      const fields = [];
      return { fields }
    })

    let value = null

    for (const id in question) {

      switch (question[id].type) {
        case 'control_fullname':
          value = {
            "qid": question[id].qid,
            "name": "control_fullname",
            "type": "Full Name",
            "value": ""
          }
          break;
        case 'control_email':
          value = {
            "qid": question[id].qid,
            "name": "control_email",
            "type": "Email Address",
            "value": ""
          }
          break;
        case 'control_address':
          value = {
            "qid": question[id].qid,
            "name": "control_address",
            "type": "Street Address",
            "value": ""
          }
          break;
        case 'control_phone':
          value = {
            "qid": question[id].qid,
            "name": "control_phone",
            "type": "Phone",
            "format": "### ### ####",
            "value": ""
          }
          break;
        case 'control_datetime':
          value = {
            "qid": question[id].qid,
            "name": "control_datetime",
            "type": "Date",
            "format": "%m-%d-%Y",
            "value": ""
          }
          break;
        case 'control_time':
          value = {
            "qid": question[id].qid,
            "name": "control_time",
            "type": "Date",
            "format": "%H-%M-%p",
            "value": ""
          }
          break;
        case 'control_textbox':
          value = {
            "qid": question[id].qid,
            "name": "control_textbox",
            "type": "Words",
            "min": 1,
            "max": 5,
            "value": ""
          }
          break;
        case 'control_textarea':
          value = {
            "qid": question[id].qid,
            "name": "control_textarea",
            "type": "Words",
            "min": 5,
            "max": 20,
            "value": ""
          }
          break;
        case 'control_dropdown':
          value = {
            "qid": question[id].qid,
            "name": "control_dropdown",
            "type": "Title",
            "value": ""
          }
          this.setState(state => {
            const others = this.state.others.concat(question[id].options)
            return { others }
          })
          break;
        case 'control_radio':
          value = {
            "qid": question[id].qid,
            "name": "control_radio",
            "type": "Title",
            "value": ""
          }
          this.setState(state => {
            const others = this.state.others.concat(question[id].options)
            return { others }
          })
          break;
        case 'control_checkbox':
          value = {
            "qid": question[id].qid,
            "name": "control_checkbox",
            "type": "Title",
            "value": ""
          }
          this.setState(state => {
            const others = this.state.others.concat(question[id].options)
            return { others }
          })
          break;
        case 'control_number':
          value = {
            "qid": question[id].qid,
            "name": "control_number",
            "type": "Number",
            "min": 1,
            "max": 99999,
            "decimals": 2,
            "value": ""
          }
          break;
        default: break;
      }

      if (value !== null) {
        this.setState(state => {
          const fields = state.fields.concat(value);
          return { fields }
        })
        value = null
      }
    }

    console.log(JSON.stringify(this.state.fields))
  }

  getRandomRecords() {
    axios({
      method: 'post',
      url: 'http://www.mockaroo.com/api/generate.json',
      headers: {
        'Accept': 'application/json'
      },
      params: {
        key: this.props.store.mocapi,
        count: 1,
        fields: JSON.stringify(this.state.fields)
      }
    })
      .then(this.handleRecords)
      .catch(this.handleError)
  }

  postFormSubmission() {
    var parsedData = {}
    const x = this.state.fields

    for (i = 0; i < x.length; i++) {
      if (x[i].name === "control_fullname") {
        var first = { [`submission[${x[i].qid}][first]`]: x[i].value.split(" ")[0] }
        var last = { [`submission[${x[i].qid}][last]`]: x[i].value.split(" ")[1] }
        parsedData = { ...parsedData, ...first, ...last }
      } else if (x[i].name === "control_address") {
        var addr_line1 = { [`submission[${x[i].qid}][addr_line1]`]: x[i].value.split(" ")[1] }
        var addr_line2 = { [`submission[${x[i].qid}][addr_line2]`]: x[i].value.split(" ")[2] }
        var postal = { [`submission[${x[i].qid}][postal]`]: x[i].value.split(" ")[0] }
        parsedData = { ...parsedData, ...addr_line1, ...addr_line2, ...postal }
      } else if (x[i].name === "control_phone") {
        var area = { [`submission[${x[i].qid}][area]`]: x[i].value.split(" ")[0] }
        var phone = { [`submission[${x[i].qid}][phone]`]: x[i].value.split(" ")[1] + x[i].value.split(" ")[2] }
        parsedData = { ...parsedData, ...area, ...phone }
      } else if (x[i].name === "control_datetime") {
        var month = { [`submission[${x[i].qid}][month]`]: x[i].value.split("-")[0] }
        var day = { [`submission[${x[i].qid}][day]`]: x[i].value.split("-")[1] }
        var year = { [`submission[${x[i].qid}][year]`]: x[i].value.split("-")[2] }
        parsedData = { ...parsedData, ...month, ...day, ...year }
      } else if (x[i].name === "control_time") {
        var hourSelect = { [`submission[${x[i].qid}][hourSelect]`]: x[i].value.split("-")[0] }
        var minuteSelect = { [`submission[${x[i].qid}][minuteSelect]`]: x[i].value.split("-")[1] }
        var ampm = { [`submission[${x[i].qid}][ampm]`]: x[i].value.split("-")[2] }
        parsedData = { ...parsedData, ...hourSelect, ...minuteSelect, ...ampm }
      } else {
        var other = { [`submission[${x[i].qid}]`]: x[i].value }
        parsedData = { ...parsedData, ...other }
      }
    }

    axios({
      method: 'post',
      url: 'http://api.jotform.com/form/' + form.id + '/submissions',
      headers: {
        'Accept': 'application/json'
      },
      params: {
        apiKey: this.props.store.jotapi,
        ...parsedData
      }
    })
      .then(this.handleSubmission)
      .catch(this.handleError)
  }

  handleSubmission = () => {
  }

  render() {
    const { navigation } = this.props;
    const phoneOptions = ['###-###-####', '(###) ###-####', '### ### ####', '+# ### ### ####', '+# (###) ###-####', '+#-###-###-####', '#-(###)###-####', '##########']
    const dateOptions = ['%m-%d-%Y', '%d-%m-%Y', '%Y-%m-%d', '%Y-%d-%m']

    return (
      <ScrollView>
        <Block flex={false} row space="between" style={styles.categories}>
          <Card middle shadow>
            <Text center style={{ paddingBottom: 15 }}>Submission</Text>
            <Input
              disabled={this.state.wait}
              placeholder="0"
              label="How many submission do you want to make?"
              style={styles.input}
              value={this.state.nofrows === 0 ? "" : this.state.nofrows.toString()}
              onChangeText={text => this.setState({ nofrows: text })}
            />
            {this.state.fields.map(field => (
              <Text key={field.name} medium height={20} styles={{ paddingTop: 20 }}>
                {(() => {
                  if (field.name === 'control_time') {
                    return 'Time : '
                  } else if (field.name === 'control_textbox') {
                    return 'Text Box : '
                  } else if (field.name === 'control_textarea') {
                    return 'Text Area : '
                  } else if (field.name === 'control_dropdown') {
                    return 'Dropdown Menu : '
                  } else if (field.name === 'control_radio') {
                    return 'Radio Button : '
                  } else if (field.name === 'control_checkbox') {
                    return 'Check Box : '
                  } else {
                    return field.type + ' : '
                  }
                })()}
                <Text gray medium caption>{field.value === '' ? 'Empty' : field.value}</Text>
              </Text>
            ))}
            <Block style={{ paddingTop: 15 }}>
              <Button disabled={this.state.wait} color="#0f9ef1" shadow onPress={() => this.setState({ defaultAnimationDialog: true })}>
                <Text center semibold white>Configure Randoms</Text>
              </Button>
              <Button disabled={this.state.wait} color="black" shadow onPress={() => this.getRandomRecords()}>
                <Text center semibold white>Fill Form</Text>
              </Button>
              <Button disabled={this.state.wait} gradient shadow onPress={() => {
                this.setState({ wait: true });
                this.setState({ flag: "send" });
                this.getRandomRecords();
              }}>
                <Text center semibold white>Send to Form</Text>
              </Button>
            </Block>
          </Card>
        </Block>

        <Dialog
          onDismiss={() => {
            this.setState({ defaultAnimationDialog: false });
          }}
          width={0.91}
          visible={this.state.defaultAnimationDialog}
          rounded={false}
          actionsBordered
          dialogTitle={
            <DialogTitle
              title="Configure Randoms Range"
              style={{
                backgroundColor: '#F7F7F8',
              }}
              hasTitleBar={false}
              align="center"
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                bordered
                onPress={() => {
                  this.setState({ defaultAnimationDialog: false });
                }}
                key="button-1"
              />
              <DialogButton
                text="OK"
                bordered
                onPress={() => {
                  this.setState({ defaultAnimationDialog: false });
                }}
                key="button-2"
              />
            </DialogFooter>
          }
        >
          <DialogContent
            style={{
              backgroundColor: '#F7F7F8',
            }}
          >

            {this.state.fields.map(field => (
              (() => {
                if (field.name === 'control_phone') {
                  return (
                    <CustomPicker
                      key={field.qid}
                      options={phoneOptions}
                      placeholder="Click to select a custom phone format:"
                      onValueChange={value => this.setState(state => {
                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                        test.format = value
                        return { test }
                      })}
                    />
                  )
                } else if (field.name === 'control_datetime') {
                  return (
                    <CustomPicker
                      key={field.qid}
                      options={dateOptions}
                      placeholder="Click to select a custom date format:"
                      onValueChange={value => this.setState(state => {
                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                        test.format = value
                        return { test }
                      })}
                    />
                  )
                } else if (field.name === 'control_textbox') {
                  return (
                    <Input
                      key={field.qid}
                      placeholder="format: min,max"
                      label="Enter a min and max word count for textbox:"
                      style={styles.input}
                      onChangeText={text => this.setState(state => {
                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                        var regex = /^\d+,\d+$/
                        regex.test(text) ?
                          [test.min = text.split(",")[0],
                          test.max = text.split(",")[1]] : null
                        return { test }
                      })}
                    />
                  )
                } else if (field.name === 'control_textarea') {
                  return (
                    <Input
                      key={field.qid}
                      placeholder="format: min,max"
                      label="Enter a min and max word count for textarea:"
                      style={styles.input}
                      onChangeText={text => this.setState(state => {
                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                        var regex = /^\d+,\d+$/
                        regex.test(text) ?
                          [test.min = text.split(",")[0],
                          test.max = text.split(",")[1]] : null
                        return { test }
                      })}
                    />
                  )
                } else if (field.name === 'control_number') {
                  return (
                    <Input
                      key={field.qid}
                      placeholder="format: min,max,decimal"
                      label="Enter a min & max and decimal range of number:"
                      style={styles.input}
                      onChangeText={text => this.setState(state => {
                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                        var regex = /^\d+,\d+,\d+$/
                        regex.test(text) ?
                          [test.min = text.split(",")[0],
                          test.max = text.split(",")[1],
                          test.decimals = text.split(",")[2]] : null
                        return { test }
                      })}
                    />
                  )
                } else {
                  return null
                }
              })()
            ))}
          </DialogContent>
        </Dialog>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  categories: {
    flexWrap: 'wrap',
    paddingTop: theme.sizes.base,
    paddingHorizontal: theme.sizes.base
  },
  input: {
    height: 30,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})

const mapStateToProps = (state) => {
  return {
    store: state.storage
  }
}

export default connect(mapStateToProps, null)(Form)
