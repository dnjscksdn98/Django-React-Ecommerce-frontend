import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Card,
  Divider,
  Grid,
  Header,
  Image,
  Item,
  Icon,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from "semantic-ui-react";

import { fetchCart } from "../store/actions/cart";

const getWidth = () => {
  const isSSR = typeof window === "undefined";
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        />
        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        {children}
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class HomepageLayout extends React.Component {
  componentDidMount() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.props.fetchCart();
    }
  }

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={8}>
                <Header
                  as="h2"
                  style={{ fontSize: "3em", textAlign: "center" }}
                >
                  Iphone 11 Pro
                </Header>
                <Item.Group>
                  <Item>
                    <Item.Description
                      style={{
                        fontSize: "1.33em",
                        lineHeight: "1.5em",
                        textAlign: "center"
                      }}
                    >
                      A transformative triple‑camera system that adds tons of
                      capability without complexity. An unprecedented leap in
                      battery life. And a mind‑blowing chip that doubles down on
                      machine learning and pushes the boundaries of what a
                      smartphone can do. Welcome to the first iPhone powerful
                      enough to be called Pro.
                    </Item.Description>
                  </Item>
                </Item.Group>

                <Header
                  as="h2"
                  style={{
                    fontSize: "3em",
                    textAlign: "center"
                  }}
                >
                  It just got a whole lot harder to take a bad photo.
                </Header>
                <Item.Group>
                  <Item>
                    <Item.Description
                      style={{
                        fontSize: "1.33em",
                        lineHeight: "1.5em",
                        textAlign: "center"
                      }}
                    >
                      All‑new dual‑camera system. Take your photos from wide to
                      ultra wide. A redesigned interface uses the new Ultra Wide
                      camera to show you what’s happening outside the frame —
                      and lets you capture it. Shoot and edit videos as easily
                      as you do photos. It’s the world’s most popular camera,
                      now with a whole new perspective.
                    </Item.Description>
                  </Item>
                </Item.Group>
              </Grid.Column>
              <Grid.Column floated="right" width={7}>
                <Image
                  rounded
                  size="large"
                  src="http://127.0.0.1:8000/media/main-1.PNG"
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Link to="/products/3">
                  <Button icon primary labelPosition="right">
                    Check them out
                    <Icon name="angle double right" />
                  </Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment style={{ padding: "0em" }} vertical>
          <Grid celled="internally" columns="equal" stackable>
            <Grid.Row textAlign="center">
              <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
                <Header as="h3" style={{ fontSize: "2em" }}>
                  Welcome to the new generation of iPad.
                </Header>
                <p style={{ fontSize: "1.33em" }}>
                  The most advanced iPad ever.
                </p>
                <Link to="/products/3">
                  <Button icon primary labelPosition="right">
                    Check them out
                    <Icon name="angle double right" />
                  </Button>
                </Link>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
                <Header as="h3" style={{ fontSize: "2em" }}>
                  Everything you hear is unheard of.
                </Header>
                <p style={{ fontSize: "1.33em" }}>
                  Active Noise Cancellation for immersive sound.
                </p>
                <Link to="/products/3">
                  <Button icon primary labelPosition="right">
                    Check them out
                    <Icon name="angle double right" />
                  </Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Container textAlign="center">
            <Container text>
              <Header as="h3" style={{ fontSize: "1.5em" }}>
                macOS Catalina
              </Header>
              <Header as="h2" style={{ fontSize: "2em" }}>
                The power of Mac. Taken further.
              </Header>
              <Item.Group>
                <Item>
                  <Item.Description
                    style={{
                      fontSize: "1.33em",
                      lineHeight: "1.5em",
                      textAlign: "center"
                    }}
                  >
                    Dedicated apps for music, TV, and podcasts. Smart new
                    features like Sidecar, powerful technologies for developers,
                    and your favorite iPad apps, now on Mac.
                  </Item.Description>
                </Item>
              </Item.Group>
            </Container>
            <Divider
              className="header"
              horizontal
              style={{ margin: "3em 0em", textTransform: "uppercase" }}
            >
              <Header as="h3">Which Mac notebook is right for you?</Header>
            </Divider>
            {/* <Image src="http://127.0.0.1:8000/media/main-2.PNG" /> */}
            <Grid columns={3} divided>
              <Grid.Row>
                <Grid.Column>
                  <Card fluid>
                    <Image src="http://127.0.0.1:8000/media/main-2-1.PNG" />
                    <Card.Content>
                      <Card.Header>MacBook Air</Card.Header>
                      <Card.Meta>
                        <span className="date">Starting at $1099</span>
                      </Card.Meta>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        13.3-inch Retina display
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        2-core Intel Core i5 processor
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 16GB memory
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 1TB storage
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 12 hours battery life
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Touch ID
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Backlit keyboard
                      </Card.Description>
                    </Card.Content>
                    <Link to="/products/4" style={{ marginBottom: "10px" }}>
                      <Button icon primary labelPosition="right">
                        Buy now
                        <Icon name="angle double right" />
                      </Button>
                    </Link>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card fluid>
                    <Image src="http://127.0.0.1:8000/media/main-2-2.PNG" />

                    <Card.Content>
                      <Card.Header>MacBook Pro 13"</Card.Header>
                      <Card.Meta>
                        <span className="date">Starting at $1299</span>
                      </Card.Meta>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        13.3-inch Retina display
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 4-core Intel Core i7 processor
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 16GB memory
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 2TB storage
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 10 hours battery life
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Touch Bar and Touch ID
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Backlit keyboard
                      </Card.Description>
                    </Card.Content>

                    <Link to="/products/1" style={{ marginBottom: "10px" }}>
                      <Button icon primary labelPosition="right">
                        Buy now
                        <Icon name="angle double right" />
                      </Button>
                    </Link>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card fluid>
                    <Image src="http://127.0.0.1:8000/media/main-2-3.PNG" />

                    <Card.Content>
                      <Card.Header>MacBook Pro 16"</Card.Header>
                      <Card.Meta>
                        <span className="date">Starting at $2399</span>
                      </Card.Meta>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        16-inch Retina display
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 8-core Intel Core i9 processor
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 64GB memory
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 8TB storage
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Up to 11 hours battery life
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Touch Bar and Touch ID
                      </Card.Description>
                      <Card.Description style={{ lineHeight: "2.5em" }}>
                        Backlit Magic Keyboard
                      </Card.Description>
                    </Card.Content>

                    <Link to="/products/2" style={{ marginBottom: "10px" }}>
                      <Button icon primary labelPosition="right">
                        Buy now
                        <Icon name="angle double right" />
                      </Button>
                    </Link>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {/* <Header as="h3" style={{ fontSize: "2em" }}>
          Did We Tell You About Our Bananas?
        </Header>
        <p style={{ fontSize: "1.33em" }}>
          Yes I know you probably disregarded the earlier boasts as non-sequitur
          filler content, but it's really true. It took years of gene splicing
          and combinatory DNA research, but our bananas can really dance.
        </p>
        <Button as="a" size="large">
          I'm Still Quite Interested
        </Button> */}
          </Container>
        </Segment>
      </ResponsiveContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomepageLayout);
