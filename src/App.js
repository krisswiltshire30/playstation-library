import React, { Component } from "react";
import axios from "axios";
import './components/stylesheet.css';

class App extends Component {
  state = {
    data: [],
    id: 0,
    name: null,
    platform: null,
    genre: null,
    release_date: null,
    players: null,
    publisher: null,
    intervalIsSet: false
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (name, platform, genre, release_date, players, publisher) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      name: name,
      platform: platform,
      genre: genre,
      release_date: release_date,
      players: players,
      publisher: publisher
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <div>
          <img className='logo' src={require("./components/images/playstation-logo.png")} alt="ps-logo" />
          <span className='main-header'>Library</span>
        </div>
        <hr />
        <div className='menu'>
          <h4 className='menu-button'>My Games</h4>
          <h4 className='menu-button'>Add Game</h4>
        </div>
        <div className='main-box'>
          <ul className="game-list">
            {data.length <= 0
              ? 'Empty'
              : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.id}>
                  <span> {dat.name} </span>
                </li>
              ))}
          </ul>
          <div>
            <p>Add a game to your library</p>
            <input
              type="text"
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ platform: e.target.value })}
              placeholder="Platform"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ genre: e.target.value })}
              placeholder="Genre"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ release_date: e.target.value })}
              placeholder="Release Date - dd/mm/yyyy"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ players: e.target.value })}
              placeholder="Players"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ publisher: e.target.value })}
              placeholder="Publisher"
            />
            <button style={{ width: '200px' }}
              onClick={() => this.putDataToDB(this.state.name, 
                                              this.state.platform, 
                                              this.state.genre, 
                                              this.state.release_date,
                                              this.state.players,
                                              this.state.publisher,
                                              )}>ADD
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;