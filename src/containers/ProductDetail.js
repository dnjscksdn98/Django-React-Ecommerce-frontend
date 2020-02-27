import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Button,
  Container,
  Card,
  Dimmer,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Select
} from "semantic-ui-react";

import { productDetailURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {}
  };

  componentDidMount() {
    this.handleFetchProduct();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible
    });
  };

  handleFetchProduct = () => {
    const {
      match: { params }
    } = this.props;
    this.setState({ loading: true });
    axios
      .get(productDetailURL(params.productID))
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (event, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormData
    });
  };

  handleFormatData = formData => {
    return Object.keys(formData).map(key => {
      return formData[key];
    });
  };

  handleAddToCart = slug => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);

    authAxios
      .post(addToCartURL, { slug, variations })
      .then(res => {
        // refresh the cart
        this.props.fetchCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, formData, formVisible, loading } = this.state;
    const item = data;

    return (
      <Container style={{ marginTop: "100px" }}>
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
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                image={item.image}
                header={item.title}
                meta={item.category}
                description={item.long_description}
                extra={
                  <React.Fragment>
                    <Button
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={this.handleToggleForm}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button>
                    {item.label !== "Default" && (
                      <Label
                        color={
                          item.label === "New"
                            ? "olive"
                            : item.label === "Best seller"
                            ? "red"
                            : null
                        }
                      >
                        {item.label}
                      </Label>
                    )}
                  </React.Fragment>
                }
              />
              {formVisible && (
                <React.Fragment>
                  <Divider />
                  <Form>
                    {data.variations.map(variation => {
                      const name = variation.name.toLowerCase();
                      return (
                        <Form.Field key={variation.id}>
                          <Select
                            onChange={this.handleChange}
                            options={variation.item_variations.map(item => {
                              return {
                                key: item.id,
                                text: item.value,
                                value: item.id
                              };
                            })}
                            placeholder={`Select a ${name}`}
                            selection
                            name={name}
                            value={formData[name]}
                          />
                        </Form.Field>
                      );
                    })}

                    <Form.Button
                      primary
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Submit
                    </Form.Button>
                  </Form>
                </React.Fragment>
              )}
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Select your variations</Header>
              {data.variations &&
                data.variations.map(variation => {
                  return (
                    <React.Fragment key={variation.id}>
                      <Header as="h3">{variation.name}</Header>
                      <Item.Group divided>
                        {variation.item_variations.map(itemVariation => {
                          return (
                            <Item key={itemVariation.id}>
                              {itemVariation.attachment && (
                                <Item.Image
                                  size="tiny"
                                  src={`http://127.0.0.1:8000${itemVariation.attachment}`}
                                />
                              )}
                              <Item.Content verticalAlign="middle">
                                {itemVariation.value}
                              </Item.Content>
                            </Item>
                          );
                        })}
                      </Item.Group>
                    </React.Fragment>
                  );
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
