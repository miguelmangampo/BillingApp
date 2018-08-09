import React, { Component } from 'react';
import {
    BackHandler,
    View,
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
  ActionSheet,
  List,
  ListItem,
  Footer,
} from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import Modal from 'react-native-modal';
import DefaultSpinner from '../../components/spinner';
import ClientVehicleTitle from '../../components/clientVehicleTitle';
import styles from './styles';
import defaultStyles from '../../styles';
import AppConfig from '../../AppConfig';
import PaymentDetailsModal from '../../components/paymentDetailsModal';
import PayablesModal from '../../components/payablesModal';

import * as Utilities from '../../actions/UtilityAction';
import * as BillingActions from '../../actions/BillingAction';
import * as Dialogs from '../../actions/DialogAction';

const menus = {
  options: [
    { text: "Payables", icon: "md-calendar", iconColor: "#777" },
    { text: "Refresh", icon: "refresh", iconColor: "#777" },
  ],
  DESTRUCTIVE_INDEX: 3,
  CANCEL_INDEX: 4,
};

class Payments extends Component {
  constructor(props) {
    super(props);

    this.clientVehicleID = this.props.navigation.state.params.clientVehicleID;
    this.state = {
      clientName: this.props.navigation.state.params.clientName,
      vehicleName: this.props.navigation.state.params.vehicleName,
      paymentList: [],
      payableList: [],
      payableTotalAmtDue: 0,
      payabletotalBalance: 0,
      totalPaidAmt: 0,
      totalRecords: 0,
      isLoading: true,
      detailsModalVisible: false,
      payablesModalVisible: false,
      selectedDetails: {},
    };

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.initList();
  }

  checkAuthValidity = (error) => {
    if (error && error.statusCode == types.UNAUTHORIZED_RESPONSE) {
      this.props.navigation.navigate("Login");
    } else if (error) {
      Dialogs.showAlert('Bad Request', 'Error upon getting payment list.');
    }
  }

  initList = () => {
    BillingActions.getPayments(this.clientVehicleID, (error, response) => {
      this.checkAuthValidity(error);

      this.setState({ 
        paymentList: (error) ? [] : response.list,
        totalPaidAmt: (error) ? 0 : response.totalPaidAmt,
        totalRecords: (error) ? 0 : response.totalRecords,
        isLoading: false,
      });
    });
  }

  initPayableList = () => {
    BillingActions.getPayables(this.clientVehicleID, (error, success) => {
      this.checkAuthValidity(error);

      this.setState({ 
        payableList: (error) ? [] : success.list,
        payableTotalAmtDue: (error) ? 0 : success.total[0].TotalAmountDue,
        payabletotalBalance: (error) ? 0 : success.total[0].TotalBalance,
        isLoading: false,
        payablesModalVisible: true,
      });
    });
  }

  refresh = () => {
    this.setState({ isLoading: true });
    this.initList();
  }

  onItemPress = (data) => {
    this.setState({ 
      detailsModalVisible: true,
      selectedDetails: data,
    });
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
        if (buttonIndex == 0) { // Payables
          this.setState({ isLoading: true });
          this.initPayableList();
        } else if (buttonIndex == 1) { // Refresh
          this.refresh();
        } 
      }
    );
  }

  render() {
    const { clientName, 
            vehicleName,
            paymentList,
            totalPaidAmt,
            totalRecords,
            detailsModalVisible,
            payablesModalVisible,
            selectedDetails,
            payableList,
            payableTotalAmtDue,
            payabletotalBalance,

            isLoading } = this.state;
    if (isLoading) {
      return (<DefaultSpinner message="Please wait..." />);
    }

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
            <Title>Payments</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={() => this.onMenuPress()}>
              <Icon name="more" />
            </Button>
          </Right>
        </Header>

        <Modal isVisible={detailsModalVisible}>
          <PaymentDetailsModal 
            data={selectedDetails} 
            close={() => this.setState({ detailsModalVisible: false })} />
        </Modal>

        <Modal isVisible={payablesModalVisible}>
          <PayablesModal
            payableList={payableList}
            totalAmountDue={payableTotalAmtDue}
            totalBalance={payabletotalBalance}

            close={() => this.setState({ payablesModalVisible: false })} />
        </Modal>

        <ClientVehicleTitle clientName={clientName} vehicleName={vehicleName} />
        <Text style={[defaultStyles.titleLabel, styles.listTitle]}>
          Payment List (click item to view more details)
        </Text>
        <Content style={styles.listContainer}>
          <List
            dataArray={paymentList}
            renderRow={data =>
              <ListItem onPress={() => this.onItemPress(data)}>
                <Body>
                  <Grid>
                    <Col>
                      <Text style={styles.labelPayDate}>
                        {Utilities.defaultDateFormat(data.paymentDate)}
                      </Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.labelPayDate, defaultStyles.labelColor]}>
                        {data.Mode}
                      </Text>
                    </Col>
                  </Grid>

                  <Grid>
                    <Col>
                      <Text style={styles.labelAmount}>
                        {Utilities.defaultMoneyFormat(data.Amount)}
                      </Text>
                    </Col>
                    { data.isCancelled == 1
                      && 
                      <Col style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.labelAmount, styles.labelBold]}>CANCELLED</Text>
                      </Col>
                    }
                  </Grid>
                </Body>
              </ListItem>
            }
          />
          
        </Content>
        <Footer style={defaultStyles.primaryColor}>
          <Body style={styles.footerContainer}>
            <Text style={styles.footerTitle}>Total Payments:</Text>
            <Text style={styles.footerValue}>{Utilities.defaultMoneyFormat(totalPaidAmt)}</Text>
          </Body>
        </Footer>
      </Container>
    )
  }
}

export default Payments;
