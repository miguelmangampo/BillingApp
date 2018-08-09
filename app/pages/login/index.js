import React, { Component } from 'react';
import {
    View,
    Alert,
    ScrollView
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Right,
  Input,
  Item,
  Toast,
  Thumbnail,
} from "native-base";
import DefaultSpinner from '../../components/spinner';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Actions from '../../actions/LoginAction';
import * as Dialogs from '../../actions/DialogAction';
import * as types from '../../actions/types';

import AppConfig from '../../AppConfig';
const gmsLogo = require("../../../img/gms-logo.png");

class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: ''
		}
	}

	onLoginPress = () => {
		const { username, password } = this.state;
		this.props.attemptLogin(username, password, (response) => {
			if (types.RESPONSE_ERROR === response.status) {
				Dialogs.showAlert('Bad Request', response.msg);
				return;
			}
			this.props.navigation.navigate("Drawer");
		});
	}

	onUsernameChange = (text) => {
		this.setState({ username: text });
	}

	onPasswordChange = (text) => {
		this.setState({ password: text });
	}

	render() {
		const isLoading = this.props.loading;
		let inputView = null;
		if (isLoading) {
			return (<DefaultSpinner message="Authenticating..." />);	
		} 

		return (
			<ScrollView>
				<Container style={styles.container}>
					<Thumbnail square large source={gmsLogo} style={styles.imageLogo}/>
					<Text style={[defaultStyles.labelColor, styles.title]}>
						Billing App
					</Text>
					<Text style={styles.caption}>
						Analyze, locate everywhere
					</Text>
					
					<Item regular style={styles.textInput}>
						<Input placeholder="Username"
							value={this.state.username}
							onChangeText={this.onUsernameChange} />
					</Item>
					<Item regular style={styles.textInput}>
						<Input placeholder="Password" 
							secureTextEntry={true}
							value={this.state.password}
							onChangeText={this.onPasswordChange}/>
					</Item>
					<Button block style={styles.loginButton}
						onPress={() => this.onLoginPress()}>
						<Text>Log In</Text>
					</Button>
				</Container>
			</ScrollView>
		);
	}
}


function mapStateToProps(state, props) {
	return {
		loading: state.LoginReducer.loading,
		data: state.LoginReducer.data
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
