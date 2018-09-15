import React, { Component } from 'react';
import './App.css';

class App extends Component {

  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    scriptLoad("https://maps.googleapis.com/maps/api/js?key=AIzaSyBX_gcT9_iiz8kp_BuYe0vxLw6HNqRbnRY&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    }); 
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

function scriptLoad(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
