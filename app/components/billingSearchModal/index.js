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
  CardItem,
  ActionSheet,
  Footer,
  H3,
  Label,
  Picker,
} from "native-base";
import { 
  View, 
} from "react-native";

import { Grid, Col } from "react-native-easy-grid";
import styles from './styles';
import defaultStyles from '../../styles';
import DefaultSpinner from '../spinner';
import AppConfig from '../../AppConfig';
import * as Utilities from '../../actions/UtilityAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HeaderModal from '../headerModal';

import _ from 'lodash';

class BillingSearchModal extends Component {
  constructor(props){
    super(props);

    let initialCompany = _.find(AppConfig.companyList, (company) => {
      return company.id == AppConfig.billing.companyID;
    });

    this.state = {
      selectedCompany: initialCompany.id,
      selectedAccountType: '',
      selectedVehicleType: '',
      clientName: '',
      vehicleName: '',
      isOriginCompany: Utilities.isOriginCompany(),
    };
  }

  render() {
    if (this.props.loading) {
      return (
        <Container>
          <DefaultSpinner message="Searching..." />
        </Container>
      );
    }

    let companies = _.map(AppConfig.companyList, (company) => {
      return <Item label={company.companyName} value={company.id} />;
    });

    return (
      <Container style={defaultStyles.modalContainer}>
        <HeaderModal 
          iconName='search'
          title='Search'
          onClose={() => this.props.close()}/>

        <Content style={defaultStyles.modalContent}>
          <Text style={[defaultStyles.titleLabel, styles.infoLabel]}>Leave blank to exclude on searching.</Text>

          { this.state.isOriginCompany &&
            <View>
              <Text style={defaultStyles.titleLabel}>Company</Text>
              <Picker
                note
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selectedCompany}
                onValueChange={(value) => this.setState({ selectedCompany: value })}
                style={styles.searchInput}>
                {companies}
              </Picker>
            </View>
          }

          <Grid>
            <Col>
              <Text style={defaultStyles.titleLabel}>Account Type</Text>
              <Picker
                note
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selectedAccountType}
                onValueChange={(value) => this.setState({ selectedAccountType: value })}
                style={styles.searchInput}>
                <Item label="ALL" value="ALL" />
                <Item label="TELEMATICS" value="TELEMATICS" />
                <Item label="TRICYCLE" value="TRICYCLE" />
              </Picker>
            </Col>
            <Col>
              <Text style={defaultStyles.titleLabel}>Vehicle Type</Text>
              <Picker
                note
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selectedVehicleType}
                onValueChange={(value) => this.setState({ selectedVehicleType: value })}
                style={styles.searchInput}>
                <Item label="ALL" value="0" />
              </Picker>
            </Col>
          </Grid>

          <Text style={[defaultStyles.titleLabel, styles.titleLabel]}>Client name</Text>
          <Item regular style={styles.searchInput}>
            <Input placeholder="Search client name"
                  value={this.state.clientName}
                  onChangeText={(text) => this.setState({ clientName: text })} />
          </Item>

          <Text style={[defaultStyles.titleLabel, styles.titleLabel]}>Vehicle name</Text>
          <Item regular style={styles.searchInput}>
            <Input placeholder="Search vehicle name"
                  value={this.state.vehicleName}
                  onChangeText={(text) => this.setState({ vehicleName: text })} />
          </Item>

          <Button block style={styles.searchBtn}
            onPress={() => this.props.search(this.state.selectedCompany, this.state.selectedAccountType, this.state.selectedVehicleType, this.state.clientName, this.state.vehicleName)}>
            <Text>Search</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    loading: state.BillingReducer.loading,
  }
}

export default connect(mapStateToProps, null)(BillingSearchModal);