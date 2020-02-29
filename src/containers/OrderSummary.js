import React from "react";
import {
  Container,
  Header,
  Label,
  Table,
  Button,
  Message,
  Dimmer,
  Dropdown,
  Loader,
  Segment,
  Image,
  Icon
} from "semantic-ui-react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { fetchCart } from "../store/actions/cart";
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
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.handleFetchOrder();
    }
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

  handleFormatData = itemOptions => {
    // convert [{id: 1},{id: 2}] to [1,2] - they're all variations
    return Object.keys(itemOptions).map(key => {
      return itemOptions[key].id;
    });
  };

  handleAddItemQuantity = (slug, itemOptions) => {
    this.setState({ loading: true });
    const options = this.handleFormatData(itemOptions);
    authAxios
      .post(addToCartURL, { slug, options })
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
        this.props.fetchCart();
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
        this.props.fetchCart();
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

    // if (data === []) {
    //   return (
    //     // <React.Fragment>
    //     //   <Redirect to="/" />
    //     //   <Message
    //     //     warning
    //     //     header="Your cart is empty!"
    //     //     content="Add products to your cart."
    //     //   />
    //     // </React.Fragment>
    //     <Redirect to="/" />
    //   );
    // }

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
                    <Table.Cell>
                      <Dropdown loading={loading} text={order_item.item.title}>
                        <Dropdown.Menu>
                          <React.Fragment>
                            {order_item.item_options.map(item_option => {
                              return (
                                <Dropdown.Item key={item_option.id}>
                                  {item_option.value}
                                </Dropdown.Item>
                              );
                            })}
                          </React.Fragment>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Table.Cell>
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
                          this.handleAddItemQuantity(
                            order_item.item.slug,
                            order_item.item_options
                          )
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      $ {order_item.final_price}
                      {order_item.item.discount_price && (
                        <Label color="teal" tag style={{ marginLeft: "20px" }}>
                          <Icon name="dollar sign" /> ON DISCOUNT
                        </Label>
                      )}
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

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderSummary)
);
