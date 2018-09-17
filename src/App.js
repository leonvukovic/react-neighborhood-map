import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';

var map;

class App extends Component {

  state = {
    venues: [],
    markers: [],
    query: ''
  }

  componentDidMount() {
    this.getVenues()
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
    this.checkQuery();
    this.setMarkers();
  }

  updateMarkers = (markers) => {
    console.log(markers);
    this.setState({ markers: markers })
  }

  // Get Forsquare data
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "RBCZ3PMP2LKASH0HSVROBYWNQIIL2W0KDUG5U3EM3VGJWOPB",
      client_secret: "BKBSL1SEYCQJIC5D5HLORDHGO1XI51MHDSWZLQCWKKSFKUT1",
      query: "pizza",
      near: "Varaždin",
      v: "20180409"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          // Data in state
          venues: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        alert("ERROR!! " + error)
      })
  }

  loadMap = () => {
    scriptLoad("https://maps.googleapis.com/maps/api/js?key=AIzaSyBX_gcT9_iiz8kp_BuYe0vxLw6HNqRbnRY&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.305746, lng: 16.336607},
      zoom: 13
    });
    this.checkQuery();
    this.setMarkers();
  }

  setMarkers = () => {
    this.state.markers.map(markers => {
      const marker = new window.google.maps.Marker({
        position: {lat: markers.venue.location.lat, lng: markers.venue.location.lng},
        map: map,
        title: markers.venue.name
      });
      marker.setMap(map);
    })
  }

  checkQuery = () => {
    // Filter the markers based on the query
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      this.updateMarkers(this.state.venues.filter((venues) => match.test(venues.venue.name)))
    } else {
      this.updateMarkers(this.state.venues);
    }
  }

  render() {
    return (
      <main>
        <input
          aria-label="Search places"
          className="App-search-places"
          type="text"
          placeholder="Search places"
          value={this.state.query}
          onChange={(event) => this.updateQuery(event.target.value)}
        />
        <div id="map"></div>
      </main>
    );
  }
}

function scriptLoad(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
