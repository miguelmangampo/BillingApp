import React, { Component } from 'react';
import {
    ActivityIndicator,
    View
} from 'react-native';
import {
  Text,
  Spinner,
  Thumbnail,
} from "native-base";
import styles from './styles';

const gmsLogo = require("../../../img/gms-logo.png");

class DefaultSpinner extends Component {
	render() {
		return (
			<View style={styles.view}>
				<Thumbnail square source={gmsLogo} style={styles.imageLogo}/>
				<Spinner color="blue" />
				<Text>{this.props.message}</Text>
			</View>
		);
	}
}

export default DefaultSpinner;
