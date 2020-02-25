import React from "react";
import {
  Button,
  Header,
  Grid,
  Divider,
  Menu,
  Form,
  Loader,
  Message,
  Segment,
  Dimmer,
  Image,
  Select,
  Card,
  Label,
  Icon,
  Table
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import {
  addressListURL,
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  countryListURL,
  userIDURL,
  paymentListURL
} from "../constants";
import { authAxios } from "../utils";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

class PaymentHistory extends React.Component {
  state = {
    payments: [],
    loading: false,
    error: null
  };

  componentDidMount() {
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({ loading: true });
    authAxios
      .get(paymentListURL)
      .then(res =>
        this.setState({
          loading: false,
          payments: res.data
        })
      )
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { payments, loading, error } = this.state;

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID #</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {payments.map(payment => {
            return (
              <Table.Row key={payment.id}>
                <Table.Cell>{payment.id}</Table.Cell>
                <Table.Cell>$ {payment.amount}</Table.Cell>
                <Table.Cell>
                  {new Date(payment.timestamp).toUTCString()}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class AddressForm extends React.Component {
  state = {
    loading: false,
    error: null,
    saving: false,
    success: false,
    formData: {
      address_type: "",
      street_address: "",
      apartment_address: "",
      country: "",
      zip: "",
      user: "",
      default: false
    }
  };

  componentDidMount() {
    const { formType, address } = this.props;
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
  }

  handleChange = event => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [event.target.name]: event.target.value
    };
    this.setState({ formData: updatedFormData });
  };

  handleSelectChange = (event, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({ formData: updatedFormData });
  };

  handleToggleChange = () => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      default: !formData.default
    };
    this.setState({ formData: updatedFormData });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { formType } = this.props;

    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    this.setState({ saving: true });
    const { userID, activeItem } = this.props;
    const { formData } = this.state;

    authAxios
      .post(addressCreateURL, {
        formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleUpdateAddress = () => {
    this.setState({ saving: true });
    const { userID, activeItem } = this.props;
    const { formData } = this.state;

    authAxios
      .put(addressUpdateURL(formData.id), {
        formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S"
      })
      .then(res => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false }
        });
        this.props.callback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const { countries } = this.props;
    const { error, success, saving, formData } = this.state;

    return (
      <Form
        autoComplete="off"
        onSubmit={this.handleSubmit}
        success={success}
        error={error}
      >
        <Form.Input
          name="street_address"
          placeholder="Street Address"
          required
          onChange={this.handleChange}
          value={formData.street_address}
        />
        <Form.Input
          name="apartment_address"
          placeholder="Apartment Address"
          required
          onChange={this.handleChange}
          value={formData.apartment_address}
        />
        <Form.Field required>
          <Select
            loading={countries.length < 1}
            name="country"
            placeholder="Country"
            clearable
            search
            options={countries}
            fluid
            onChange={this.handleSelectChange}
            value={formData.country}
          />
        </Form.Field>
        <Form.Input
          name="zip"
          placeholder="Zip Code"
          required
          onChange={this.handleChange}
          value={formData.zip}
        />
        <Form.Checkbox
          name="default"
          label="Make this the default address"
          onChange={this.handleToggleChange}
          checked={formData.default}
        />
        {success && (
          <Message
            success
            header="Success!"
            content="Your address was successfully saved."
          />
        )}
        {error && (
          <Message
            error
            header="There was an error."
            content={JSON.stringify(error)}
          />
        )}
        <Form.Button primary disabled={saving} loading={saving}>
          <Icon name="save" />
          Save
        </Form.Button>
      </Form>
    );
  }
}

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    addresses: [],
    countries: [],
    userID: null,
    selectedAddress: null
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
    this.handleFetchUserID();
  }

  handleItemClick = name => {
    this.setState({ activeItem: name }, () => {
      this.handleCallback();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    if (activeItem === "billingAddress") {
      return "Billing Address";
    } else if (activeItem === "shippingAddress") {
      return "Shipping Address";
    }
    return "Payment History";
  };

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then(res => {
        this.setState({ userID: res.data.userID });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleFormatCountries = countries => {
    const keys = Object.keys(countries);
    return keys.map(k => {
      return {
        key: k,
        text: countries[k],
        value: k
      };
    });
  };

  handleFetchCountries = () => {
    authAxios
      .get(countryListURL)
      .then(res => {
        this.setState({ countries: this.handleFormatCountries(res.data) });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  handleSelectAddress = address => {
    this.setState({ selectedAddress: address });
  };

  handleDeleteAddress = addressID => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then(res => {
        this.handleCallback();
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  handleFetchAddresses = () => {
    const { activeItem } = this.state;
    this.setState({ loading: true });
    authAxios
      .get(addressListURL(activeItem === "billingAddress" ? "B" : "S"))
      .then(res => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  renderAddresses = () => {
    const {
      activeItem,
      addresses,
      countries,
      selectedAddress,
      userID
    } = this.state;

    return (
      <React.Fragment>
        <Card.Group>
          {addresses.map(address => {
            return (
              <Card fluid key={address.id}>
                <Card.Content>
                  {address.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default Address
                    </Label>
                  )}
                  <Card.Header>
                    {address.street_address}, {address.apartment_address}
                  </Card.Header>
                  <Card.Meta>{address.country}</Card.Meta>
                  <Card.Description>{address.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="olive"
                    onClick={() => this.handleSelectAddress(address)}
                  >
                    <Icon name="upload" />
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => this.handleDeleteAddress(address.id)}
                  >
                    <Icon name="trash" />
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>

        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            countries={countries}
            formType={CREATE_FORM}
            userID={userID}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            countries={countries}
            formType={UPDATE_FORM}
            address={selectedAddress}
            userID={userID}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { activeItem, loading, error } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <Grid container columns={2} divided style={{ marginTop: "50px" }}>
        <Grid.Row columns={1}>
          <Grid.Column>
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Menu pointing vertical fluid>
              <Menu.Item
                name="Billing Address"
                active={activeItem === "billingAddress"}
                onClick={() => this.handleItemClick("billingAddress")}
              />
              <Menu.Item
                name="Shipping Address"
                active={activeItem === "shippingAddress"}
                onClick={() => this.handleItemClick("shippingAddress")}
              />
              <Menu.Item
                name="Payment History"
                active={activeItem === "paymentHistory"}
                onClick={() => this.handleItemClick("paymentHistory")}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>{this.handleGetActiveItem()}</Header>
            <Divider />
            {activeItem === "paymentHistory" ? (
              <PaymentHistory />
            ) : (
              this.renderAddresses()
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps, null)(Profile);
