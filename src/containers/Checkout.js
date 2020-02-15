import React from "react";
import {
  CardElement,
  injectStripe,
  Elements,
  StripeProvider
} from "react-stripe-elements";
import {
  Button,
  Container,
  Message,
  Item,
  Divider,
  Header,
  Loader,
  Segment,
  Dimmer,
  Image,
  Label,
  Form,
  Select
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";

import { authAxios } from "../utils";
import {
  checkoutURL,
  orderSummaryURL,
  addCouponURL,
  addressListURL
} from "../constants";

const OrderPreview = props => {
  const { data } = props;
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <Item.Group relaxed>
            {data.order_items.map((orderItem, index) => {
              console.log(orderItem);
              return (
                <Item key={index}>
                  <Item.Image
                    size="tiny"
                    src={`http://127.0.0.1:8000${orderItem.item_obj.image}`}
                  />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="a">
                      {orderItem.quantity} x {orderItem.item_obj.title}
                    </Item.Header>
                    <Item.Extra>
                      <Label>$ {orderItem.final_price}</Label>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>

          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  Order Total: $ {data.total}
                  {data.coupon && (
                    <Label color="green" style={{ marginLeft: "10px" }}>
                      Current coupon: {data.coupon.code} for $
                      {data.coupon.amount}
                    </Label>
                  )}
                </Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

class CouponForm extends React.Component {
  state = {
    code: ""
  };

  handleChange = event => {
    this.setState({
      code: event.target.value
    });
  };

  handleSubmit = event => {
    const { code } = this.state;
    this.props.handleAddCoupon(event, code);
    this.setState({ code: "" });
  };

  render() {
    const { code } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Header>Coupon code</Header>
            <input
              placeholder="Enter a coupon."
              value={code}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

class CheckoutForm extends React.Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
    billingAddresses: [],
    shippingAddresses: [],
    defaultBillingAddress: "",
    defaultShippingAddress: ""
  };

  componentDidMount() {
    this.handleFetchOrder();
    this.handleFetchBillingAddresses();
    this.handleFetchShippingAddresses();
  }

  handleSelectChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleGetDefaultAddress = addresses => {
    const filteredAddresses = addresses.filter(address => address.default);
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].id;
    }
    return "";
  };

  handleFetchBillingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListURL("B"))
      .then(res => {
        this.setState({
          billingAddresses: res.data.map(address => {
            return {
              key: address.id,
              text: `${address.street_address}, ${address.apartment_address}, ${address.country}`,
              value: address.id
            };
          }),
          defaultBillingAddress: this.handleGetDefaultAddress(res.data),
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchShippingAddresses = () => {
    this.setState({ loading: true });
    authAxios
      .get(addressListURL("S"))
      .then(res => {
        this.setState({
          shippingAddresses: res.data.map(address => {
            return {
              key: address.id,
              text: `${address.street_address}, ${address.apartment_address}, ${address.country}`,
              value: address.id
            };
          }),
          defaultShippingAddress: this.handleGetDefaultAddress(res.data),
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.props.history.push("/products");
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  handleAddCoupon = (event, code) => {
    event.preventDefault();
    this.setState({ loading: true });
    authAxios
      .post(addCouponURL, { code })
      .then(res => {
        this.setState({ loading: false });
        this.handleFetchOrder();
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  submit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.props.stripe) {
      this.props.stripe.createToken().then(result => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          this.setState({ error: null });
          const { defaultBillingAddress, defaultShippingAddress } = this.state;
          authAxios
            .post(checkoutURL, {
              stripeToken: result.token.id,
              defaultBillingAddress,
              defaultShippingAddress
            })
            .then(res => {
              this.setState({ loading: false, success: true });
              // redirect the user
            })
            .catch(err => {
              this.setState({ loading: false, error: err });
            });
        }
      });
    } else {
      console.log("Stripe is not loaded");
    }
  };

  render() {
    const {
      data,
      error,
      loading,
      success,
      billingAddresses,
      shippingAddresses,
      defaultBillingAddress,
      defaultShippingAddress
    } = this.state;

    return (
      <div>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
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

        <OrderPreview data={data} />
        <Divider />
        <CouponForm
          handleAddCoupon={(event, code) => this.handleAddCoupon(event, code)}
        />
        <Divider />

        <Header>Select a billing address</Header>
        {billingAddresses.length > 0 ? (
          <Select
            clearable
            options={billingAddresses}
            selection
            value={defaultBillingAddress}
            name="defaultBillingAddress"
            onChange={this.handleSelectChange}
          />
        ) : (
          <Header>
            You need to <Link to="/profile">add a billing address</Link>.
          </Header>
        )}

        <Header>Select a shipping address</Header>
        {shippingAddresses.length > 0 ? (
          <Select
            clearable
            options={shippingAddresses}
            selection
            value={defaultShippingAddress}
            name="defaultShippingAddress"
            onChange={this.handleSelectChange}
          />
        ) : (
          <Header>
            You need to <Link to="/profile">add a shipping address</Link>.
          </Header>
        )}

        <Divider />
        {billingAddresses.length < 1 || shippingAddresses.length < 1 ? (
          <Header>
            You need to add addresses before completing your purchase.
          </Header>
        ) : (
          <React.Fragment>
            <Header>Would you like to complete the purchase?</Header>
            <CardElement />
            {success && (
              <Message positive>
                <Message.Header>Your payment was successful</Message.Header>
                <p>
                  Go to your <b>profile</b> to see the order delivery status.
                </p>
              </Message>
            )}
            <Button
              loading={loading}
              disabled={loading}
              primary
              onClick={this.submit}
              style={{ marginTop: "30px" }}
            >
              Submit
            </Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const InjectedForm = withRouter(injectStripe(CheckoutForm));

const WrappedForm = () => (
  <Container text style={{ marginTop: "100px", marginBottom: "200px" }}>
    <StripeProvider apiKey="pk_test_O934QkJvZFxzsLTj270UgOZc003V0PRbpz">
      <div>
        <h1>Complete your order</h1>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  </Container>
);

export default WrappedForm;
