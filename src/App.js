import React, { Component } from 'react';
import './App.css';
import Places from './components/Places';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';

var map;
var savedMarkers = [];
var filteredMarkers = [];

class App extends Component {

  state = {
    venues: [],
    query: '',
    markers: []
  }

  componentDidMount() {
    this.getVenues()
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  checkQueryIf = () => {
    const match = new RegExp(escapeRegExp(this.state.query), 'i')
    this.showMarkers(savedMarkers);
    filteredMarkers = this.state.markers.filter((marker) => match.test(marker.title));
    this.arrayDiff(filteredMarkers, savedMarkers);
  }
  checkQueryElse = () => {
    this.showMarkers(savedMarkers);
  }

  arrayDiff = (arr1, arr2) => {
    var newArr = [];
    arr1.map(function(val){
     return arr2.indexOf(val) < 0 ? newArr.push(val) : '';
    });
    arr2.map(function(val){
     return arr1.indexOf(val) < 0 ? newArr.push(val) : '';
    });
    this.clearMarkers(newArr);
  }

  clearMarkers = (filteredMarkers) => {
    // Loop through markers and set map to null for each
    for (var i = 0; i < filteredMarkers.length; i++) {
      filteredMarkers[i].setMap(null);
    }
  }

  showMarkers = (filteredMarkers) => {
    // Loop through markers and set map for each
    for (var i = 0; i < filteredMarkers.length; i++) {
      filteredMarkers[i].setMap(map);
    }
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
    // Create map
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.305746, lng: 16.336607},
      zoom: 13
    });

    // Create infowindow
    var infowindow = new window.google.maps.InfoWindow();

    // Create markers
    this.state.venues.map(markers => {


      // Create marker
      var marker = new window.google.maps.Marker({
        position: {lat: markers.venue.location.lat, lng: markers.venue.location.lng},
        map: map,
        title: markers.venue.name,
        animation: window.google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      // Save marker object in state
      savedMarkers.push(marker);
      this.setState({
        markers: savedMarkers
      });

      // On marker click
      marker.addListener('click', function() {
        markerClick(marker);
      });

      function markerClick(marker) {
        if (infoWindowStatus(infowindow)){
          // infowindow is open
          infowindow.close(map, marker);
          // Loop through markers and set icon
          for (var i = 0; i < savedMarkers.length; i++) {
            savedMarkers[i].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
          }
          marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);

        } else {
          // infowindow is closed
          marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);
        }
      }

      // Close infowindow on exit button
      infowindow.addListener('closeclick', function() {
        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
      });

      // Place click open infoWindow
      this.openInfoWindow = (place) => {
        this.state.markers.filter((marker) => {
          if (marker.title === place.venue.name) {
            markerClick(marker);
          }

          return marker;
        });
      }

      // Check if infowindow is open or closed
      function infoWindowStatus(infowindow){
        var map = infowindow.getMap();
        return (map !== null && typeof map !== "undefined");
      }

      return marker;
    })
  }

  render() {
    // Filter the markers based on the query
    if (this.state.query) {
      this.checkQueryIf();
    } else {
      this.checkQueryElse();
    }

    return (
      <main>
        <header className="App-header">
          <h1 className="App-title">Welcome to React Neighborghood-map app</h1>
        </header>
        <div className="App-menu">
          <input
          aria-label="Search places"
          className="App-search-places"
          type="text"
          placeholder="Search places"
          value={this.state.query}
          onChange={(event) => this.updateQuery(event.target.value)}
          />
          <Places openInfoWindow={this.openInfoWindow} places={this.state.venues} query={this.state.query}/>
          <a href="https://foursquare.com/" rel="noopener noreferrer" target="_blank" className="App-menu__bottom-link"><p>Powerd by </p><img src="https://seeklogo.com/images/F/foursquare-new-logo-D1F831A9E1-seeklogo.com.png" alt="foursquare logo"/></a>
        </div>
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
