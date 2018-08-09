import React, { Component } from 'react';
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
  CardItem
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from './styles';
import * as Utilities from '../../actions/UtilityAction';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class BillingListItem extends Component {
	constructor(props){
		super(props);
	}

	_renderLoadMore() {
		if (this.props.loading) {
			return (<Spinner color="blue" />);
		} else {
			return (
				<Button full
					onPress={() => this.props.onLoadMorePress()}>
					<Text>{'Load More (' + this.props.totalLoadedRecords + ' / ' + this.props.totalRecords + ')'}</Text>
				</Button>
			);
		}
	}

	render() {
		if (this.props.data.isLoadMoreComponent) {
			return (
				<Content>
					{this._renderLoadMore()}
				</Content>
			);
		} else {
			return (
				<Card style={styles.clientCard}>
					<CardItem>
						<Body>
							<Text style={styles.clientName}>{this.props.data.clientName}</Text>
							<Text style={styles.vehicleName}>{this.props.data.vehicleName}</Text>
							
							<Grid>
								<Col>
									<Text style={styles.billingTitle}>Start of Mobility</Text>
									<Text style={styles.billingValue}>
										{Utilities.defaultDateFormat(this.props.data.startOfMobility)}
									</Text>

									<Text style={styles.billingTitle}>Deadline</Text>
									<Text style={styles.billingValue}>
										{Utilities.defaultDateFormat(this.props.data.deadlineDate)}
									</Text>

									<Text style={styles.billingTitle}>Last Service</Text>
									<Text style={styles.billingValue}>
										{this.props.data.lastServiceDate}
									</Text>

									<Button block
										style={styles.billingBtn}
										onPress={() => this.props.onDevicePress()}>
										<Text>DEVICE</Text>
									</Button>
								</Col>
								<Col style={styles.alignRight}>
									<Text style={styles.billingTitle}>Activation Status</Text>
									{ 
										this.props.data.apiData 
										&& this.props.data.apiData.activationStatus 
										&&
										<Text style={[styles.billingValue, Utilities.getActivationStatusColor(this.props.data.apiData.activationStatus.status)]}>
											{this.props.data.apiData.activationStatus.status}
										</Text>
									}
									{ 
										(!this.props.data.apiData 
										|| !this.props.data.apiData.activationStatus)
										&&
										<Text style={styles.billingValue}>
											NO DATA
										</Text>
									}

									<Text style={styles.billingTitle}>Balance</Text>
									<Text style={styles.billingValue}>
										{Utilities.defaultMoneyFormat(this.props.data.balance)}
									</Text>

									<Text style={styles.billingTitle}>Unpaid Service</Text>
									<Text style={styles.billingValue}>
										{Utilities.defaultMoneyFormat(this.props.data.unpaidService)}
									</Text>

									<Button block
										style={[styles.billingBtn, styles.paymentBtn]}
										onPress={() => this.props.onPaymentPress()}>
										<Text>PAYMENTS</Text>
									</Button>
								</Col>
							</Grid>
						</Body>
					</CardItem>
				</Card>
			);
		}
	}
}

function mapStateToProps(state, props) {
	return {
		loading: state.BillingReducer.loading,
	}
}

export default connect(mapStateToProps, null)(BillingListItem);