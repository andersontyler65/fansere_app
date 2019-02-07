import React, { Component } from 'react'
import {StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Header, ListItem, Card, Button } from 'react-native-elements';
import axios from 'axios'
import NBA, { getTeamFromTeamMap } from '../../utilities/nba'
import TeamMap from '../../utilities/TeamMap'
import { formatDateString } from '../../utilities/date'
import { selectGame, changeDate } from '../../actions/actions'

export default class ScheduleItem extends React.Component {
  constructor() {
      super()

      this.nba = new NBA()
      this._renderGame = this._renderGame.bind(this)
    }

    getTeamAbbreviation(teamID) {
      return Object.keys(TeamMap).find((x) => {
        return TeamMap[x].id == teamID
      }).toUpperCase()
    }

    _selectGame(game) {
      // get key of according to team id
      const homeTeamAbbreviation = this.getTeamAbbreviation(game.hTeam.teamId)
      const awayTeamAbbreviation = this.getTeamAbbreviation(game.vTeam.teamId)

      const selectedGame = {
        awayTeam: {
          abbreviation: awayTeamAbbreviation,
          teamID: game.vTeam.teamId
        },
        homeTeam: {
          abbreviation: homeTeamAbbreviation,
          teamID: game.hTeam.teamId
        },
        gameID: game.gameId
      }

      let dateOfGame = game.startDateEastern
      const year     = dateOfGame.substring(0,4)
      const month    = dateOfGame.substring(4,6)
      const day      = dateOfGame.substring(6,8)
      dateOfGame     = month + '/' + day + '/' + year

      this.props.changeDate(dateOfGame)
      this.props.selectGame(selectedGame)
      this.props.navigator.navigate('Game', { title: `${awayTeamAbbreviation} vs ${homeTeamAbbreviation}`})
    }

    _keyExtractor(game){
      return game.gameId
    }

    _renderGame(game) {
      game = game.item

      const homeTeam = getTeamFromTeamMap(game.hTeam.teamId).team
      const awayTeam = getTeamFromTeamMap(game.vTeam.teamId).team
      const isSelectedTeamHome = game.hTeam.teamId === this.props.teamID
      const homeScore = game.hTeam.score
      const awayScore = game.vTeam.score
      const outcome = isSelectedTeamHome ? (parseInt(homeScore) > parseInt(awayScore) ? 'W' : 'L') : (parseInt(awayScore) > parseInt(homeScore) ? 'W' : 'L')
      const matchup = isSelectedTeamHome ? `vs ${awayTeam}` : `@ ${homeTeam}`
      const date = formatDateString(game.startDateEastern)
      const nugget = game.nugget.text

      return(
        <TouchableOpacity style={styles.gameCell} onPress={() => { this._selectGame(game) }}>
          <View style={{ flexDirection: 'row', flex: 2 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.textSecondary}> {outcome} </Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10 }}>
              <Text style={styles.textSecondary}> {date} {matchup} </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
              <Text style={styles.textSecondary}> {awayScore} - {homeScore} </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textSecondary, { fontSize: 14, color: '#C7C7C7' }]}> {nugget} </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  const styles = StyleSheet.create({
    textPrimary: {
      color: '#D3D3D3',
      fontSize: 24,
      fontFamily: 'Rubik-Light'
    },
    textSecondary: {
      color: '#D3D3D3',
      fontSize: 18,
      fontFamily: 'Rubik-Light'
    },
    gameCell: {
      flexDirection: 'column',
      marginLeft: 10,
      marginRight: 10,
      height: 65,
      borderBottomColor: '#333333',
      borderBottomWidth: 1,
    },
  })

  function mapStateToProps(state) {
    return {
      teamID: state.scores.selectedTeam.teamID
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      changeDate: (date) => dispatch(changeDate(date)),
      selectGame: (selectedGame) => dispatch(selectGame(selectedGame))
    }
}
