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
import { Grid, Col, Row } from "react-native-easy-grid";
import Modal from 'react-native-modal';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Utilities from '../../actions/UtilityAction';
import HeaderModal from '../../components/headerModal';

class PaymentDetailsModal extends Component {
  render() {
    const refID = (this.props.data.ReferenceID && this.props.data.ReferenceID.length > 0) ? this.props.data.ReferenceID : ' ';
    const transID = (this.props.data.TransactionID && this.props.data.TransactionID.length > 0) ? this.props.data.TransactionID : ' ';
    const comment = (this.props.data.comments && this.props.data.comments.length > 0) ? this.props.data.comments : ' ';

    return (
      <Container style={defaultStyles.modalContainer}>
        <HeaderModal 
          iconName='logo-yen'
          title='Details'
          onClose={() => this.props.close()}/>

        <Content style={defaultStyles.modalContent}>
          <Grid style={styles.modalRow}>
            <Col>
              <Text style={defaultStyles.titleLabel}>Receipt No</Text>
              <Text style={defaultStyles.labelColor}>{this.props.data.receiptNo}</Text>
            </Col>
            <Col>
              <Text style={defaultStyles.titleLabel}>Mode</Text>
              <Text style={defaultStyles.labelColor}>{this.props.data.Mode}</Text>
            </Col>
          </Grid>

          <Grid style={styles.modalRow}>
            <Col>
              <Text style={defaultStyles.titleLabel}>Payment Date</Text>
              <Text style={defaultStyles.labelColor}>{Utilities.defaultDateFormat(this.props.data.paymentDate)}</Text>
            </Col>
            <Col>
              <Text style={defaultStyles.titleLabel}>Amount</Text>
              <Text style={defaultStyles.labelColor}>{Utilities.defaultMoneyFormat(this.props.data.Amount)}</Text>
            </Col>
          </Grid>

          <Grid style={styles.modalRow}>
            <Col>
              <Text style={defaultStyles.titleLabel}>Reference ID</Text>
              <Text style={defaultStyles.labelColor}>
                {refID}
              </Text>
            </Col>
            <Col>
              <Text style={defaultStyles.titleLabel}>Transaction ID</Text>
              <Text style={defaultStyles.labelColor}>
                {transID}
              </Text>
            </Col>
          </Grid>

          { this.props.data.isCancelled == 1
            &&
            <View style={styles.modalRow}>
              <Text style={defaultStyles.titleLabel}>Cancelled By</Text>
              <Text style={defaultStyles.labelColor}>{this.props.data.cancelledBy}</Text>
            </View>
          }

          <View style={styles.modalRow}>
            <Text style={defaultStyles.titleLabel}>Comment</Text>
            <Text style={defaultStyles.labelColor}>{comment}</Text>
          </View>

        </Content>
      </Container>
    );
  }
}

export default PaymentDetailsModal;