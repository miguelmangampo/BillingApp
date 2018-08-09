import React, { Component } from 'react';
import {
    View,
	BackHandler
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
import MapView from 'react-native-maps';
import DefaultSpinner from '../../components/spinner';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Utilities from '../../actions/UtilityAction';
import * as Actions from '../../actions/DeviceDetailsAction';
import * as types from '../../actions/types';
import moment from 'moment';
import _ from 'lodash';

const latDelta = 0.015;
const lonDelta = 0.0121;

class RouteMap extends Component {
	constructor(props){
		super(props);

		BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack();
			return true;
		});

		this.serviceEntityID = this.props.navigation.state.params.serviceEntityID;
		this.vehicleName = this.props.navigation.state.params.vehicleName;
		const region = {
			latitude: 14.5995,
			longitude: 120.9842,
			latitudeDelta: latDelta,
			longitudeDelta: lonDelta,	
		};
		this.marker = {
			title: this.props.navigation.state.params.clientName || '',
			description: this.vehicleName,
		};
		this.state = {
			isLoading: true,
			mapRegion: region,
			marker: this.marker,
			routes: [],
		};

		this.loadData();
	}

	refresh = () => {
		this.setState({ isLoading: true });
		this.loadData();
	}

	checkAuthValidity = (error) => {
		if (error && error.statusCode == types.UNAUTHORIZED_RESPONSE) {
			this.props.navigation.navigate("Login");
		} else if (error) {
			Dialogs.showAlert('Bad Request', 'Error upon mobility routes.');
		}
	}

	loadData = () => {
		var fromDate = moment().subtract(1, 'days').add(1, 'minutes');
		var createdFrom = fromDate.format('YYYY-MM-DD h:mm a');
		var createdTo = moment().format('YYYY-MM-DD h:mm a');

		Actions.getStatus(this.serviceEntityID, (error1, responseStatus) => {
			this.checkAuthValidity(error1);

			Actions.getMobilityData(this.serviceEntityID, createdFrom, createdTo, (error2, responseData) => {
				const routes = [];
				_.forEach((responseData || []), (data) => {
					routes.push({
						latitude: data.lat, 
						longitude: data.lon
					})
				});

				this.marker.description = this.vehicleName + ' - ' + ((responseStatus) ? responseStatus.activationStatus.status : '');				
				this.setState({
					isLoading: false,
					mapRegion: {
						latitude: (responseStatus) ? responseStatus.latestData.lat : 0,
						longitude: (responseStatus) ? responseStatus.latestData.lon : 0,
						latitudeDelta: latDelta,
						longitudeDelta: lonDelta,	
					},
					marker: this.marker,
					routes: routes,
				});
			});
		});
	}

	render() {
		const {
			isLoading,
			mapRegion,
			marker,
			routes,
		} = this.state;

		if (isLoading) {
			return (<DefaultSpinner message="Loading..." />);
		}

	    return (
			<Container>
				<Header style={defaultStyles.primaryColor}>
					<Left>
						<Button 
						transparent 
						onPress={() => this.props.navigation.goBack()}>
							<Icon name="md-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Location</Title>
					</Body>
					<Right>
						<Button transparent
						onPress={() => this.refresh()}>
							<Icon name="refresh" />
						</Button>
					</Right>
				</Header>

				<MapView
					style={styles.map}
					zoomEnabled={true}
					region={mapRegion}>
					<MapView.Marker
						coordinate={mapRegion}
						title={marker.title}
						description={marker.description}/>
					<MapView.Polyline
						coordinates={routes}
						strokeColor={'#0000FF'}
						strokeWidth={3}
					/>
				</MapView>
			</Container>	
	    );
	}
}

export default RouteMap;
