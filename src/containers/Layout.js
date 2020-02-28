import React from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  Dropdown,
  Image,
  List,
  Menu,
  Segment,
  Icon
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }

  render() {
    const { authenticated, cart, loading } = this.props;
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>
            <Link to="/products">
              <Menu.Item header>Products</Menu.Item>
            </Link>
            <Menu.Menu position="right">
              {authenticated ? (
                <React.Fragment>
                  <Link to="/profile">
                    <Menu.Item>
                      <Icon name="user" />
                      Profile
                    </Menu.Item>
                  </Link>
                  <Dropdown
                    icon="cart"
                    loading={loading}
                    text={`${cart !== null ? cart.order_items.length : 0}`}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {cart !== null && cart.order_items.length !== 0 ? (
                        <React.Fragment>
                          {cart.order_items.map(order_item => {
                            return (
                              <Dropdown.Item
                                key={order_item.id}
                                onClick={() =>
                                  this.props.history.push(
                                    `/products/${order_item.item.id}`
                                  )
                                }
                              >
                                {order_item.quantity} x {order_item.item.title}
                              </Dropdown.Item>
                            );
                          })}
                          {/* {cart.order_items.length === 0 ? (
                            <Dropdown.Item>No Items</Dropdown.Item>
                          ) : null} */}
                          <Dropdown.Divider />
                          <Dropdown.Item
                            icon="arrow right"
                            text="Checkout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item>No items</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Link to="/login">
                    <Menu.Item header>Login</Menu.Item>
                  </Link>
                  <Link to="/signup">
                    <Menu.Item header>Signup</Menu.Item>
                  </Link>
                </React.Fragment>
              )}
            </Menu.Menu>
          </Container>
        </Menu>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Shop and learn" />
                <List link inverted>
                  {/* Todo : add product description page */}
                  <List.Item as="a">Iphone</List.Item>
                  <List.Item as="a">Mac</List.Item>
                  <List.Item as="a">Ipad</List.Item>
                  <List.Item as="a">Airpods</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Account" />
                <List link inverted>
                  <List.Item as="a">Apple ID</List.Item>
                  <List.Item as="a">Apple store ID</List.Item>
                  {authenticated ? (
                    <List.Item as="a">Logout</List.Item>
                  ) : (
                    <React.Fragment>
                      <List.Item as="a">Login</List.Item>
                      <List.Item as="a">Signup</List.Item>
                    </React.Fragment>
                  )}
                </List>
              </Grid.Column>

              <Grid.Column width={7}>
                <Header
                  inverted
                  as="h4"
                  content="Thank you for visiting our shop"
                />
                <p>
                  More ways to shop: Find an Apple Store or other retailer near
                  you.
                </p>
                <p>Or call 1-800-MY-APPLE.</p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            {/* <Image
              centered
              size="mini"
              src="http://127.0.0.1:8000/media/logo.jpg"
            /> */}
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
