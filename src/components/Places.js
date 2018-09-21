import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';

class Places extends Component {
  // Clicked places list item
  openInfoWindow = (place) => {
    this.props.openInfoWindow && this.props.openInfoWindow(place);
  }

  render() {
    // Variable that holds filtered places
    let showingPlaces

    // Filter the places based on the query
    if (this.props.query) {
      const match = new RegExp(escapeRegExp(this.props.query), 'i')
      showingPlaces = this.props.places.filter((venues) => match.test(venues.venue.name))
    } else {
      showingPlaces = this.props.places
    }

    // Map over data from state and make list of places
    const placesList = showingPlaces.map((venues, i) => {
      return <li className="App-place" onClick={(e) => this.openInfoWindow(venues, e)} key={i}>{venues.venue.name}</li>
    });

    return (
      <ul className="App-places">
        {placesList}
      </ul>
    )
  }
}

export default Places
