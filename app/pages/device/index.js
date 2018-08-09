import React, { Component } from 'react';
import {
    BackHandler,
    View
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
  Card,
  CardItem
} from "native-base";
import DefaultSpinner from '../../components/spinner';
import ClientVehicleTitle from '../../components/clientVehicleTitle';
import * as Dialogs from '../../actions/DialogAction';
import styles from './styles';
import defaultStyles from '../../styles';
import AppConfig from '../../AppConfig';
import * as Utilities from '../../actions/UtilityAction';
import * as Actions from '../../actions/DeviceDetailsAction';
import * as types from '../../actions/types';

class Device extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });


    this.serviceEntityID = this.props.navigation.state.params.serviceEntityID;
    this.state = {
      clientName: this.props.navigation.state.params.clientName,
      vehicleName: this.props.navigation.state.params.vehicleName,
      runningStatus: '',
      commStatus: '',
      activationStatus: '',
      runningTimestamp: '',
      commTimestamp: '',
      activationTimestamp: '',
      isLoading: true,
    };

    this.initDetails();
  }

  initDetails = () => {
    Actions.getStatus(this.serviceEntityID, (error, success) => {
      this.checkAuthValidity(error);

      this.setState({ 
        runningStatus: (success && success.runningStatus) ? success.runningStatus.status : '',
        commStatus: (success && success.commStatus) ? success.commStatus.status : '',
        activationStatus: (success && success.activationStatus) ? success.activationStatus.status : '',
        runningTimestamp: (success && success.runningStatus) ? Utilities.defaultDateTimeFormat(success.runningStatus.updatedAt) : '',
        commTimestamp: (success && success.commStatus) ? Utilities.defaultDateTimeFormat(success.commStatus.updatedAt) : '',
        activationTimestamp: (success && success.activationStatus) ? Utilities.defaultDateTimeFormat(success.activationStatus.updatedAt) : '',
        isLoading: false 
      });

      if (error) {
        Dialogs.showAlert('Bad Request', 'Error upon getting device details.');
      }
    })
  }

  checkAuthValidity = (error) => {
    if (error && error.statusCode == types.UNAUTHORIZED_RESPONSE) {
      this.props.navigation.navigate("Login");
    }
  }

  refresh = () => {
    this.setState({ isLoading: true });
    this.initDetails();
  }

  getButtonText = (status) => {
    if (!status) { return ''; }

    status = (status) ? status.trim().toUpperCase() : '';
    let actionText = '';
    if (status == 'INACTIVE') {
      actionText = 'ACTIVATE';
    } else if (status== 'ACTIVE') {
      actionText = 'DEACTIVATE';
    } else if ((status == 'DEACTIVATING')
      || (status == 'WAITING_TO_DEACT')
      || (status == 'ACTIVATING')
      || (status == 'WAITING_TO_ACT')) {
      actionText = 'CANCEL';
    } else if ((status == 'RESERVING_TO_ACTIVATE')
      || (status == 'RESERVING_TO_DEACTIVATE')) {
      actionText = 'CANCEL_RESERVATION';
    }
    return actionText;
  }

  activation = () => {
    const action = this.getButtonText(this.state.activationStatus);
    Dialogs.confirm('Activation', 'Are you sure you want to proceed to ' + action, () => {
      this.setState({ isLoading: true });
      Actions.activation(this.serviceEntityID, action, (error, success) => {
        if (error) {
          this.setState({ isLoading: false });
          Dialogs.showAlert('Bad Request', 'Error upon device activation.');
          return;
        }
        this.initDetails();
      });
    });
  }

  gotoMap = () => {
    this.props.navigation.navigate("RouteMap", {
      clientName: this.state.clientName,
      vehicleName: this.state.vehicleName,
      serviceEntityID: this.serviceEntityID || ''
    });
  }

  getButtonColor = (status) => {
    let color = '#d5d8dc';
    if (status.trim().toUpperCase() == 'INACTIVE') {
      color = '#1e8449';
    } else if (status.trim().toUpperCase() == 'ACTIVE') {
      color = '#922b21';
    } else if (status.trim().toUpperCase() == 'DEACTIVATING'
            || status.trim().toUpperCase() == 'WAITING_TO_DEACT'
            || status.trim().toUpperCase() == 'ACTIVATING'
            || status.trim().toUpperCase() == 'WAITING_TO_ACT'
            || status.trim().toUpperCase() == 'RESERVING_TO_ACTIVATE'
            || status.trim().toUpperCase() == 'RESERVING_TO_DEACTIVATE') {
      color = '#b8860b';
    }
    return { backgroundColor: color }
  }

  render() {
    const { clientName, 
            vehicleName,
            runningStatus,
            commStatus,
            activationStatus,
            runningTimestamp,
            commTimestamp,
            activationTimestamp,
            isLoading } = this.state;
    let content = isLoading
        ? (<DefaultSpinner message="Please wait..." />)
        : (
            <Content>
              <ClientVehicleTitle clientName={clientName} vehicleName={vehicleName} />

              <View style={styles.deviceContainer}>
                <Text style={defaultStyles.titleLabel}>Running status:</Text>
                <View style={styles.statusContainer}>
                  <Text style={[defaultStyles.valueLabel, styles.marginStatus]}>{runningStatus}</Text>
                  <Text style={styles.timestampLabel}>{runningTimestamp}</Text>
                </View>
              </View>

              <View style={styles.deviceContainer}>
                <Text style={defaultStyles.titleLabel}>Comm status:</Text>
                <View style={styles.statusContainer}>
                  <Text style={[defaultStyles.valueLabel, styles.marginStatus]}>{commStatus}</Text>
                  <Text style={styles.timestampLabel}>{commTimestamp}</Text>
                </View>
              </View>

              <View style={styles.deviceContainer}>
                <Text style={defaultStyles.titleLabel}>Activation status:</Text>
                <View style={styles.statusContainer}>
                  <Text style={[defaultStyles.valueLabel, styles.marginStatus, , Utilities.getActivationStatusColor(activationStatus)]}>{activationStatus}</Text>
                  <Text style={styles.timestampLabel}>{activationTimestamp}</Text>
                </View>
              </View>

              <Button block style={[styles.activationBtn, this.getButtonColor(activationStatus)]}
                onPress={() => this.activation()}>
                <Text>{this.getButtonText(activationStatus)}</Text>
              </Button>
            </Content>
        );
    return (
      <Container style={styles.container}>
        <Header style={defaultStyles.primaryColor}>
          <Left>
            <Button 
              transparent 
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="md-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Device</Title>
          </Body>
            <Right>
              <Button transparent
                onPress={() => this.gotoMap()}>
                <Icon name="md-map" />
              </Button>
              <Button transparent
                onPress={() => this.refresh()}>
                <Icon name="refresh" />
              </Button>
            </Right>
        </Header>
        {content}
      </Container>
    )
  }
}

export default Device;
