import React, { Component } from 'react';
import {
    View
} from 'react-native';
import {
  Text
} from "native-base";
import styles from './styles';

class ClientVehicleTitle extends Component {
	render() {
		return (
			<View style={styles.titleContainer}>
				<Text style={styles.clientName}>{this.props.clientName}</Text>
				<Text style={styles.vehicleName}>{this.props.vehicleName}</Text>
			</View>
		);
	}
}

export default ClientVehicleTitle;
