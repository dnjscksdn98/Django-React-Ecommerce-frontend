import React from "react";
import {
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
  Label
} from "semantic-ui-react";

import {
  addressListURL,
  addressCreateURL,
  countryListURL,
  userIDURL
} from "../constants";
import { authAxios } from "../utils";

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    loading: false,
    error: null,
    addresses: [],
    countries: [],
    formData: { default: false },
    saving: false,
    success: false,
    userID: null
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
    this.handleFetchUserID();
  }

  handleItemClick = name => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
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

  handleCreateAddress = event => {
    this.setState({ saving: true });
    event.preventDefault();
    const { formData, activeItem, userID } = this.state;

    authAxios
      .post(addressCreateURL, {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S"
      })
      .then(res => {
        this.setState({ saving: false, success: true });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

  render() {
    const {
      activeItem,
      loading,
      error,
      addresses,
      countries,
      saving,
      success
    } = this.state;

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
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>{`Update your ${
              activeItem === "billingAddress" ? "Billing" : "Shipping"
            } address`}</Header>
            <Divider />
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
                  </Card>
                );
              })}
            </Card.Group>
            {addresses.length > 0 ? <Divider /> : null}
            <Form
              autoComplete="off"
              onSubmit={this.handleCreateAddress}
              success={success}
            >
              <Form.Input
                name="street_address"
                placeholder="Street Address"
                required
                onChange={this.handleChange}
              />
              <Form.Input
                name="apartment_address"
                placeholder="Apartment Address"
                required
                onChange={this.handleChange}
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
                />
              </Form.Field>
              <Form.Input
                name="zip"
                placeholder="Zip Code"
                required
                onChange={this.handleChange}
              />
              <Form.Checkbox
                name="default"
                label="Make this the default address"
                onChange={this.handleToggleChange}
              />
              {success && (
                <Message
                  success
                  header="Success!"
                  content="Your address was saved."
                />
              )}
              <Form.Button primary disabled={saving} loading={saving}>
                Save
              </Form.Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Profile;
