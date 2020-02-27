import React from "react";
import {
  Container,
  Header,
  Label,
  Table,
  Button,
  Message,
  Dimmer,
  Loader,
  Segment,
  Image,
  Icon
} from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { authAxios } from "../utils";
import {
  orderSummaryURL,
  orderItemDeleteURL,
  orderItemSubtractURL,
  addToCartURL
} from "../constants";

class OrderSummary extends React.Component {
  state = {
    data: null,
    error: null,
    loading: false
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            error: "You currently don't have an order.",
            loading: false
          });
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  handleAddItemQuantity = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then(res => {
        this.setState({ loading: false });
        // callback
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleSubtractItemQuantity = slug => {
    authAxios
      .post(orderItemSubtractURL, { slug })
      .then(res => {
        this.setState({ loading: false });
        // callback
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleRemoveItem = itemID => {
    authAxios
      .delete(orderItemDeleteURL(itemID))
      .then(res => {
        // callback
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const { data, error, loading } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <Container style={{ marginTop: "100px" }}>
        <Header as="h3">Order Summary</Header>
        {error && (
          <Message
            error
            header="There was an error."
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {data && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item #</Table.HeaderCell>
                <Table.HeaderCell>Item name</Table.HeaderCell>
                <Table.HeaderCell>Item price</Table.HeaderCell>
                <Table.HeaderCell>Item quantity</Table.HeaderCell>
                <Table.HeaderCell>Total item price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_items.map((order_item, index) => {
                return (
                  <Table.Row key={order_item.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{order_item.item.title}</Table.Cell>
                    <Table.Cell>$ {order_item.item.price}</Table.Cell>
                    <Table.Cell>
                      <Icon
                        name="minus"
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        onClick={() =>
                          this.handleSubtractItemQuantity(order_item.item.slug)
                        }
                      />
                      {order_item.quantity}
                      <Icon
                        name="plus"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() =>
                          this.handleAddItemQuantity(order_item.item.slug)
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {order_item.item.discount_price && (
                        <Label color="blue" ribbon>
                          ON DISCOUNT
                        </Label>
                      )}
                      $ {order_item.final_price}
                      <Icon
                        name="trash"
                        color="red"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => this.handleRemoveItem(order_item.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="2" textAlign="center">
                  Order Total : $ {data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <Link to="/checkout">
                    <Button color="yellow">
                      <Icon name="check" />
                      Checkout
                    </Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps, null)(OrderSummary);
