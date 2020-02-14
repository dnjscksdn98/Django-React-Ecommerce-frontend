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
  Select
} from "semantic-ui-react";

import { addressListURL, addressCreateURL, countryListURL } from "../constants";
import { authAxios } from "../utils";

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    loading: false,
    error: null,
    addresses: [],
    countries: [],
    formData: {}
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
  }

  handleItemClick = name => this.setState({ activeItem: name });

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
    this.setState({ loading: true });
    authAxios
      .get(addressListURL)
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

  handleCreateAddress = event => {
    event.preventDefault();
    const { formData } = this.state;
    console.log(formData);
  };

  render() {
    const { activeItem, loading, error, addresses, countries } = this.state;
    console.log(countries);

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
            {addresses.map(address => {
              return <div>{address.street_address}</div>;
            })}
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
            }`}</Header>
            <Divider />
            <Form autoComplete="off">
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
                  name="country"
                  placeholder="Country"
                  clearable
                  search
                  options={[]}
                  fluid
                  onChange={this.handleChange}
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
                onChange={this.handleChange}
              />
              <Form.Button primary>Save</Form.Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Profile;
