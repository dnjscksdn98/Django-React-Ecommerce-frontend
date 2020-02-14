import React from "react";
import {
  Container,
  Header,
  Icon,
  Label,
  Menu,
  Table,
  Button,
  Message,
  Dimmer,
  Loader,
  Segment,
  Image
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import { authAxios } from "../utils";
import { orderSummaryURL } from "../constants";

class OrderSummary extends React.Component {
  state = {
    data: null,
    error: null,
    loading: null
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

  render() {
    const { data, error, loading } = this.state;
    console.log(data);

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
                    <Table.Cell>{order_item.item}</Table.Cell>
                    <Table.Cell>$ {order_item.item_obj.price}</Table.Cell>
                    <Table.Cell>{order_item.quantity}</Table.Cell>
                    <Table.Cell>
                      {order_item.item_obj.discount_price && (
                        <Label color="olive" ribbon>
                          ON DISCOUNT
                        </Label>
                      )}
                      $ {order_item.final_price}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="2" textAlign="center">
                  Total : $ {data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <Link to="/checkout">
                    <Button color="yellow">Checkout</Button>
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

export default OrderSummary;
