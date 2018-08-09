import React, { Component } from 'react';
import {
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
  Card,
  CardItem,
  List,
  ListItem,
  Footer,
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from './styles';
import defaultStyles from '../../styles';
import HeaderModal from '../../components/headerModal';
import DefaultSpinner from '../../components/spinner';
import * as Utilities from '../../actions/UtilityAction';
import * as BillingActions from '../../actions/BillingAction';
import * as Dialogs from '../../actions/DialogAction';
import * as types from '../../actions/types';

class PayablesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payableList: this.props.payableList,
      totalAmountDue: this.props.totalAmountDue,
      totalBalance: this.props.totalBalance,
    };
  }

  render() {
    const { payableList
          , totalAmountDue
          , totalBalance } = this.state;

    return (
      <Container style={defaultStyles.modalContainer}>
        <HeaderModal 
          iconName='md-calendar'
          title='Payables'
          onClose={() => this.props.close()}/>

        <Content style={defaultStyles.modalContent}>
          <List
            dataArray={payableList}
            renderRow={data =>
              <ListItem>
                <Body>
                  <Text style={defaultStyles.valueLabel}>{'Week ' + data.sequence}</Text>
                  <Grid>
                    <Col>
                      <Text style={defaultStyles.titleLabel}>Due Date</Text>
                      <Text style={defaultStyles.valueLabel}>
                        {Utilities.defaultDateFormat(data.duedate)}
                      </Text>
                    </Col>
                    <Col>
                      <Text style={defaultStyles.titleLabel}>Balance</Text>
                      <Text style={defaultStyles.valueLabel}>
                        {Utilities.defaultMoneyFormat(data.duebal)}
                      </Text>
                    </Col>
                  </Grid>
                </Body>
              </ListItem>
            }
          />
        </Content>
        <Footer style={defaultStyles.primaryColor}>
          <Body style={styles.footerContainer}>
            <Text style={styles.footerTitle}>Total Balance:</Text>
            <Text style={styles.footerValue}>{Utilities.defaultMoneyFormat(totalBalance)}</Text>
          </Body>
        </Footer>
      </Container>
    );
  }
}

export default PayablesModal;