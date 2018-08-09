import React, { Component } from 'react';
import {
    View,
    Alert,
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
  Spinner,
  List,
  ListItem,
  Card,
  CardItem,
  ActionSheet,
  Footer,
  H3,
  Label,
  Picker
} from "native-base";
import Modal from 'react-native-modal';
import { Grid, Col } from "react-native-easy-grid";
import DefaultSpinner from '../../components/spinner';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Dialogs from '../../actions/DialogAction';
import * as Utilities from '../../actions/UtilityAction';
import * as Actions from '../../actions/BillingAction';
import * as types from '../../actions/types';
import AppConfig from '../../AppConfig';

//Components
import BillingListItem from '../../components/billingListItem';
import BillingSearchModal from '../../components/billingSearchModal';

const menus = {
	options: [
		{ text: "Search", icon: "search", iconColor: "#777" },
		{ text: "Refresh", icon: "refresh", iconColor: "#777" },
	],
	DESTRUCTIVE_INDEX: 3,
	CANCEL_INDEX: 4,
};

class Billing extends Component {
	constructor(props){
		super(props);
		
		// Disable back button on hardware device
		BackHandler.addEventListener('hardwareBackPress', () => {
			return true;
		});

		this.state = {
			isInitLoading: true,
			searchModalVisible: false,
		};

		this.searchProps = {
			companyID: 0,
			accountType: '',
			vehicleTypeID: 0,
			clientName: '',
			vehicleName: '',
		};
		AppConfig.billing.page.totalRecords = 0;
		this.loadList(1);
	}

	onMenuPress = () => {
		ActionSheet.show(
			{
				options: menus.options,
				cancelButtonIndex: menus.CANCEL_INDEX,
				destructiveButtonIndex: menus.DESTRUCTIVE_INDEX,
				title: "Options"
			},
			buttonIndex => {
				if (buttonIndex == 0) { // Search
					this.setState({ searchModalVisible: true });
				} else if (buttonIndex == 1) { // Refresh
					this.setState({ isInitLoading: true });
					this.loadList(1);
				} 
			}
		);
	}

	onSearchPress = (companyID, accountType, vehicleTypeID, clientName, vehicleName) => {
		AppConfig.billing.page.totalRecords = 0;
		this.searchProps.companyID = companyID;
		this.searchProps.accountType = accountType;
		this.searchProps.vehicleTypeID = vehicleTypeID;
		this.searchProps.clientName = clientName;
		this.searchProps.vehicleName = vehicleName;
		this.loadList(1);
	}

	onDevicePress = (clientName, vehicleName, serviceEntityID) => {
		this.props.navigation.navigate("Device", {
			clientName: clientName,
			vehicleName: vehicleName,
			serviceEntityID: serviceEntityID || ''
		});
	}

	onPaymentPress = (clientName, vehicleName, clientVehicleID) => {
		this.props.navigation.navigate("Payments", {
			clientName: clientName,
			vehicleName: vehicleName,
			clientVehicleID: clientVehicleID || 0
		});
	}

	onLoadMorePress = () => {
		this.loadList(this.props.pageNumber + 1);
	}

	checkAuthValidity = (error) => {
		if (error && error.statusCode == types.UNAUTHORIZED_RESPONSE) {
			this.props.navigation.navigate("Login");
		}
	}

	asyncDone = (error) => {
		this.setState({ isInitLoading: false, searchModalVisible: false });
		this.checkAuthValidity(error);
	}

	loadList = (pageNumber) => {
		this.props.getList(
			pageNumber
			, this.searchProps.companyID
			, this.searchProps.accountType
			, this.searchProps.vehicleTypeID
			, this.searchProps.clientName
			, this.searchProps.vehicleName
			, (error, response) => {
				this.asyncDone(error);

				if (types.RESPONSE_ERROR === response) {
					Dialogs.showAlert('Bad Request', 'Error upon connecting to server.');
					return;
				}
			}
		);
	}

	render() {
		if (this.state.isInitLoading) {
			return (<DefaultSpinner message="Connecting to server, please wait..." />);
		} else {
			let listDisplay = (this.props.billingList && this.props.billingList.length > 0) 
				? (
					<List
						dataArray={this.props.billingList}
						renderRow={data =>
							<ListItem>
								<BillingListItem 
									data={data}
									totalRecords={this.props.totalRecords}
									totalLoadedRecords={this.props.totalLoadedRecords}
									onDevicePress={() => this.onDevicePress(data.clientName, data.vehicleName, data.apiData.id)}
									onPaymentPress={() => this.onPaymentPress(data.clientName, data.vehicleName, data.clientVehicleID)}
									onLoadMorePress={() => this.onLoadMorePress()}
									/>
							</ListItem>
						}
					/>
				)
				: (
					<Text style={{ margin: 15, fontStyle: 'italic', fontSize: 14 }}>
						No data was loaded
					</Text>
				);

			return (
				<Container>
					<Header style={defaultStyles.primaryColor}>
						<Left>
							<Button 
								transparent 
								onPress={() => this.props.navigation.navigate("DrawerOpen")}>
								<Icon name="menu" />
							</Button>
						</Left>
						<Body>
							<Title>Billing</Title>
						</Body>
						<Right>
							<Button transparent
								onPress={() => this.onMenuPress()}>
								<Icon name="more" />
							</Button>
						</Right>
					</Header>

					<Modal isVisible={this.state.searchModalVisible}>
						<BillingSearchModal
							close={() => this.setState({ searchModalVisible: false })}
							search={(companyID, accountType, vehicleTypeID, clientName, vehicleName) => this.onSearchPress(companyID, accountType, vehicleTypeID, clientName, vehicleName)}
							/>
					</Modal>

					<Content>
						{listDisplay}
					</Content>
				</Container>
			);	
		}
	}
}

function mapStateToProps(state, props) {
	return {
		loading: state.BillingReducer.loading,
		billingList: state.BillingReducer.billingListDisplay,
		totalRecords: state.BillingReducer.totalRecords,
		totalLoadedRecords: state.BillingReducer.totalLoadedRecords,
		pageNumber: state.BillingReducer.pageNumber,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
