import React, { Component } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import './components/stylesheet.css';
import moment from "moment"

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
    box_art: null,
    idToDelete: null,
    idToUpdate: null,
    objIdToUpdate: null,
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

  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  putDataToDB = (name, platform, genre, release_date, players, publisher, box_art) => {
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
      publisher: publisher,
      box_art: box_art,
    });
  };

  updateDB = (idToUpdate, name, platform, genre, release_date, players, publisher, box_art) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });
    axios.post('http://localhost:3001/api/updateData', {

      id: objIdToUpdate,
      update: {
        name: name,
        platform: platform,
        genre: genre,
        release_date: release_date,
        players: players,
        publisher: publisher,
        box_art: box_art,
      },
    });
  };

  fileSelectedHandler = event => {
    this.setState({
      box_art: event.target.files[0]
    })
  }

  fileUploadHandler = () => {

  }

  handleChange = (statename, event) => {
    if (event.target.value) {
      this.setState({ [statename]: event.target.value })
    }
  }

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
          <Popup
            trigger={<button className="menu-button"> Add Game </button>}
            modal
            closeOnDocumentClick>
            <center>
              <div className='modal'>
                <p>Add a game to your library</p>
                <input
                  type="text"
                  placeholder='Name'
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Platform"
                  onChange={(e) => this.setState({ platform: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Genre"
                  onChange={(e) => this.setState({ genre: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Release Date - dd/mm/yyyy"
                  onChange={(e) => this.setState({ release_date: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Players"
                  onChange={(e) => this.setState({ players: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Publisher"
                  onChange={(e) => this.setState({ publisher: e.target.value })}
                />
                <span style={{ color: 'black' }}>Upload Image
                <input
                    type="file"
                    name="file"
                    onChange={this.fileSelectedHandler} />
                </span>
                <button className='button'
                  onClick={() => this.putDataToDB(this.state.name,
                    this.state.platform,
                    this.state.genre,
                    this.state.release_date,
                    this.state.players,
                    this.state.publisher,
                    this.state.box_art,
                    console.log(this.state)
                  )}>ADD GAME
                   </button>
              </div>
            </center>
          </Popup>
        </div>
        <div className='main-box main-box-balance'>
          <ul className="game-list">
            {data.length <= 0
              ? 'Empty'
              : data.map((dat) => (
                <li key={data.id}>
                  <Popup
                    trigger={<button className="list-button"> {dat.name} </button>}
                    modal
                    closeOnDocumentClick>
                    <div className='popup-info'>
                      <div className='list-info'>
                        <span>Name: <span style={{ color: 'black' }}>{dat.name}</span></span><br />
                        <span>Platform: <span style={{ color: 'black' }}>{dat.platform}</span></span><br />
                        <span>Genre: <span style={{ color: 'black' }}>{dat.genre}</span></span><br />
                        <span>Release Date: <span style={{ color: 'black' }}>{moment(dat.release_date).format('MM/DD/YYYY')}</span></span><br />
                        <span>No. of Players: <span style={{ color: 'black' }}>{dat.players}</span></span><br />
                        <span>Publisher: <span style={{ color: 'black' }}>{dat.publisher}</span></span><br />
                      </div>
                      <Popup
                        trigger={<button className='button'> Edit </button>}
                        modal
                        closeOnDocumentClick>
                        <center>
                          Editing {dat.name}
                          <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => this.handleChange('name', e)}
                          />
                          <input
                            type="text"
                            placeholder="Platform"
                            onChange={(e) => this.handleChange('Platform', e)}
                          />
                          <input
                            type="text"
                            placeholder="Genre"
                            onChange={(e) => this.handleChange('Genre', e)}
                          />
                          <input
                            type="text"
                            placeholder="Release Date - dd/mm/yyyy"
                            onChange={(e) => this.handleChange('release_date', e)}
                          />
                          <input
                            type="text"
                            placeholder="Players"
                            onChange={(e) => this.handleChange('players', e)}
                          />
                          <input
                            type="text"
                            placeholder="Publisher"
                            onChange={(e) => this.handleChange('publisher', e)}
                          />
                          <span style={{ color: 'black' }}>Upload Image
                        <input
                              type="file"
                              name="file"
                              onChange={this.fileSelectedHandler} />
                          </span>
                          <button onclick onClick={() => this.updateDB(dat.id, this.state.name,
                            this.state.platform,
                            this.state.genre,
                            this.state.release_date,
                            this.state.players,
                            this.state.publisher,
                            this.state.box_art,
                            console.log(this.state))}>
                            Update
                        </button>
                        </center>
                      </Popup>
                      <button className='button' onClick={() => this.deleteFromDB(dat.id)}>
                        Delete
                      </button>
                    </div>
                    <div className='box-art'>
                      <img src="https://cdn1-www.gamerevolution.com/assets/uploads/2018/01/God-of-War-Box.jpg" alt="sdas" width='270' />
                    </div>
                  </Popup>
                </li>
              ))}
          </ul>
        </div>
      </div >
    );
  }
}

export default App;