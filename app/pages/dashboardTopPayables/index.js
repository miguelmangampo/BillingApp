import React, { Component } from 'react';
import {
    BackHandler,
    View,
    ScrollView,
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
  List,
  ListItem,
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import DefaultSpinner from '../../components/spinner';
import ClientVehicleTitle from '../../components/clientVehicleTitle';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Utilities from '../../actions/UtilityAction';

class DashboardTopPayables extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payableList: this.props.navigation.state.params.payableList,
    };

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  }

  render() {
    const { payableList } = this.state;
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
            <Title>Top 25 Payables</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List
            dataArray={payableList}
            renderRow={data =>
              <ListItem>
                <Body>
                  <Grid>
                    <Col size={4}>
                      <Text style={styles.listTitle}>
                        {data.fullName}
                      </Text>
                    </Col>
                    <Col size={3} style={{ alignItems: 'flex-end' }}>
                      <Text style={[defaultStyles.valueLabel, styles.listValue]}>
                        {Utilities.defaultMoneyFormat(data.totalBalance)}
                      </Text>
                    </Col>
                  </Grid>
                </Body>
              </ListItem>
            }
          />
        </Content>
      </Container>
    )
  }
}

export default DashboardTopPayables;
