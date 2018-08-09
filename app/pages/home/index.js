import React, { Component } from 'react';
import {
    View,
    BackHandler,
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
  CardItem,
  Picker,
  List,
  ListItem,
} from "native-base";
import DefaultSpinner from '../../components/spinner';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Actions from '../../actions/HomeAction';
import * as Utilities from '../../actions/UtilityAction';
import * as Dialogs from '../../actions/DialogAction';
import * as types from '../../actions/types';
import AppConfig from '../../AppConfig';
import _ from 'lodash';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      companyID: AppConfig.companyID,
      dashboardValues: null, 
      isOriginCompany: Utilities.isOriginCompany(),
    };

    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    this.initList();
  }

  checkAuthValidity = (error) => {
    if (error && error.statusCode == types.UNAUTHORIZED_RESPONSE) {
      this.props.navigation.navigate("Login");
    } else if (error) {
      Dialogs.showAlert('Bad Request', 'Error upon getting dashboard details.');
    }
  }

  initList = (comID) => {
    const companyID = comID ? comID : this.state.companyID;
    Actions.getDashboardDetails(companyID, (error, success) => {
      this.checkAuthValidity(error);

      this.setState({
        isLoading: false,
        dashboardValues: (error) ? null : success
      });
    })
  }

  refresh = () => {
    this.setState({ isLoading: true });
    this.initList();
  }

  computeTotalChart = (data) => {
    if (!data) {
      return 0;
    }

    const total = data.january + data.february + data.march + data.april + data.may + data.june + data.july + data.august + data.september + data.october + data.november + data.december;
    return total;
  }

  computeTotalList = (data) => {
    if (!data) {
      return 0;
    }

    let total = 0;
    _.forEach(data.topUnpaidClients, (client) => {
      total += client.totalBalance;
    });
    return total;
  }

  initChartData = (data) => {
    if (!data) {
      return null;
    }

    return [
      { month: 'january', value: data.january },
      { month: 'february', value: data.february },
      { month: 'march', value: data.march },
      { month: 'april', value: data.april },
      { month: 'may', value: data.may },
      { month: 'june', value: data.june },
      { month: 'july', value: data.july },
      { month: 'august', value: data.august },
      { month: 'september', value: data.september },
      { month: 'october', value: data.october },
      { month: 'november', value: data.november },
      { month: 'december', value: data.december },
    ];
  }

  navigateChart = (title, colorScale, data) => {
    this.props.navigation.navigate("DashboardBarchart", {
      title: title,
      colorScale: colorScale,
      chartData: this.initChartData(data),
    });
  }

  onItemClicked = (data) => {
    if (!data.clickable) {
      return;
    }

    if (data.value == 0) {
      Dialogs.showAlert('Stop', 'Cannot view 0 summary value');
      return;
    }

    if (data.id == 0) {
      this.navigateChart('Release', 'blue', data.data);
    } else if (data.id == 1) {
      this.navigateChart('Payments', 'green', data.data);
    } else if (data.id == 5) {
      this.props.navigation.navigate("DashboardTopPayables", {
        payableList: data.data,
      });
    }
  }

  initSummaryList = (dashboardValues) => {
    const summaryList = [];
    const clientsWithPastDue = (dashboardValues) ? dashboardValues.clientSummary.clientsWithPastDue : 0;
    const pastDuesToday = (dashboardValues) ? dashboardValues.clientSummary.pastDuesToday : 0;
    const paymentsToday = (dashboardValues) ? dashboardValues.clientSummary.paymentsToday : 0;
    const totalUnitRelease = dashboardValues ? this.computeTotalChart(dashboardValues.monthlyUnitRelease) : 0;
    const totalPayments = dashboardValues ? this.computeTotalChart(dashboardValues.monthlyPayments) : 0;
    const totalClientPayables = dashboardValues ? this.computeTotalList(dashboardValues) : 0;
    const releaseChart = dashboardValues ? dashboardValues.monthlyUnitRelease : null;
    const paymentsChart = dashboardValues ? dashboardValues.monthlyPayments : null;
    const topClientPayables = dashboardValues ? dashboardValues.topUnpaidClients : null;

    summaryList.push({ id: 0, title: 'Total Unit Release for this Year', clickable: true, data: releaseChart, value: Utilities.defaultNumberFormat(totalUnitRelease)});
    summaryList.push({ id: 1, title: 'Total Payments for this Year', clickable: true, data: paymentsChart, value: Utilities.defaultNumberFormat(totalPayments)});
    summaryList.push({ id: 2, title: 'Number of clients due Today', clickable: false, data: null, value: Utilities.defaultNumberFormat(pastDuesToday)});
    summaryList.push({ id: 3, title: 'Number of clients paid Today', clickable: false, data: null, value: Utilities.defaultNumberFormat(paymentsToday)});
    summaryList.push({ id: 4, title: 'Number of clients with Past due', clickable: false, data: null, value: Utilities.defaultNumberFormat(clientsWithPastDue)});
    summaryList.push({ id: 5, title: 'Total Client Payables for Top 25 Clients', clickable: true, data: topClientPayables, value: Utilities.defaultMoneyFormat(totalClientPayables)});

    return summaryList;
  }

  onCompanyChanged = (companyID) => {
    this.setState({ companyID: companyID, isLoading: true });
    this.initList(companyID);
  }

  render() {
    const { companyID,
            isLoading,
            dashboardValues,
            isOriginCompany } = this.state;
    const summaryList = this.initSummaryList(dashboardValues);

    if (isLoading) {
      return (<DefaultSpinner message="Connecting to server, please wait..." />);
    }

    let companies = _.map(AppConfig.companyList, (company) => {
      return <Item label={company.companyName} value={company.id} />;
    });

    return (
      <Container style={styles.content}>
        <Header style={defaultStyles.primaryColor}>
          <Left>
            <Button 
              transparent 
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Dashboard</Title>
          </Body>
            <Right>
              <Button transparent
                onPress={() => this.refresh()}>
                <Icon name="refresh" />
              </Button>
            </Right>
        </Header>

        { isOriginCompany &&
          <View style={styles.itemContainer}>
            <Text style={defaultStyles.titleLabel}>Company</Text>
            <Picker
              note
              iosHeader="Select one"
              mode="dropdown"
              selectedValue={companyID}
              onValueChange={(value) => this.onCompanyChanged(value)}>
              <Item label="ALL COMPANY" value={-1} />
              {companies}
            </Picker>
          </View>
        }

        <Content>
          <List
            style={styles.content}
            dataArray={summaryList}
            renderRow={data =>
              <ListItem onPress={() => this.onItemClicked(data)}>
                <Body>
                  <Text style={defaultStyles.titleLabel}>{data.title}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={defaultStyles.valueLabel}>{data.value}</Text>
                  </View>
                </Body>
                {data.clickable && 
                <Right>
                  <Icon name="arrow-forward" />
                </Right>}
              </ListItem>
            }
          />

        </Content>
      </Container>
    )
  }

}


export default Home;
