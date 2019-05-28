/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Dimensions, Text, StyleSheet, View, Alert, SafeAreaView, ScrollView } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import { YAxis, XAxis, LineChart, Grid } from 'react-native-svg-charts'
import { TabView, SceneMap } from 'react-native-tab-view'
import Config from 'react-native-config'

const verticalContentInset = { top: 10, bottom: 10 }
const xAxixHeight = 50

type Props = {}
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      celsius: [],
      lux: [],
      index: 0,
      routes: [{ key: 'celsius', title: 'Celsius' }, { key: 'lux', title: 'Lux' }],
    }
  }
  componentDidMount(): void {
    this.fetchData('lux', Config.LUX_ENDPOINT)
    this.fetchData('celsius', Config.CELSIUS_ENDPOINT)
  }
  fetchData = (dataType, endpoint): void => {
    axios
      .get(endpoint)
      .then(response => {
        return response.data
      })
      .then(data => {
        this.setState({ [dataType]: data })
      })
      .catch(() => {
        Alert.alert('API ERROR', endpoint)
      })
  }
  renderGraph = (type, unit) => () => {
    const values = this.state[type].map(d => parseInt(d.value))
    return (
      <View style={{ padding: 20, backgroundColor: '#fff' }}>
        <View style={{ height: 500, flexDirection: 'row' }}>
          <YAxis
            style={{ marginBottom: xAxixHeight }}
            data={values}
            contentInset={verticalContentInset}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={10}
            formatLabel={value => `${value}${unit}`}
          />

          <View style={{ flex: 1, marginLeft: 20 }}>
            <LineChart
              style={{ flex: 1 }}
              data={values}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={verticalContentInset}
            >
              <Grid />
            </LineChart>
            <XAxis
              style={{ overflow: 'visible', marginHorizontal: -10, height: xAxixHeight }}
              data={values}
              svg={{
                fill: 'grey',
                fontSize: 10,
                rotation: 60,
                originY: 30,
                y: 5,
                x: 5,
              }}
              numberOfTicks={10}
              formatLabel={(value, index) => regularizeDate(this.state[type][index].date)}
            />
          </View>
        </View>
      </View>
    )
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Farm Monitor</Text>
          </View>
          <TabView
            swipeEnabled={true}
            navigationState={this.state}
            renderScene={SceneMap({
              celsius: this.renderGraph('celsius', 'ºC'),
              lux: this.renderGraph('lux', '☀'),
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const DATE_REGEX = /(^\w{3,})\s(\d{1,2}),\s(\d{4})\sat\s(\d{2}):(\d{2})(AM|PM)/

//
const regularizeDate = str => {
  try {
    const matched = str.match(DATE_REGEX)
    let hour = parseInt(matched[4])
    if (matched[6] === 'PM') {
      hour += 12
    } else {
      hour = matched[4]
    }

    const iso = `${matched[3]}-${monthMap[matched[1]]}-${matched[2]}T${hour}:${matched[5]}:00+09:00`
    const date = moment(iso)
    if (!date._isValid) {
      throw 'invalid date format'
    }
    return date.format('hh:mm')
  } catch (e) {
    return ''
  }
}

const monthMap = {
  January: '01',
  Feburary: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  Nobember: '11',
  December: '12',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#42A5F5',
    height: 200,
  },
  header: {
    paddingHorizontal: 20,
    height: 44,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
})
