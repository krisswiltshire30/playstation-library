import React, { Component } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import moment from "moment";
import S3FileUpload from 'react-s3';
import './components/stylesheet.css';

const config = {
  bucketName: 'ps-box-art',
  dirName: 'box-art',
  region: 'eu-west-2',
  accessKeyId: process.env.REACT_APP_AWS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
}

class App extends Component {
  state = {
    data: [],
    files: [],
    file: null,
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
    this.state.data.forEach((game) => {
      if (game.id === idTodelete) {
        objIdToDelete = game._id;
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
    this.state.data.forEach((game) => {
      if (game.id === idToUpdate) {
        objIdToUpdate = game._id;
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

  handleChange = (statename, event) => {
    if (event.target.value !== event) {
      this.setState({ [statename]: event.target.value })
    } else {
      this.setState({ [statename]: null })
    }
  }

  handleUpload = (e) => {
    console.log(e.target.files[0]);
    S3FileUpload.uploadFile(e.target.files[0], config)
      .then((data) => {
        console.log(data.location)
        this.setState({ box_art: data.location })
      })
      .catch((err) => {
        console.log(err)
      })

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
                <input type="file" onChange={this.handleUpload} />
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
              : data.map((game) => (
                <li key={data.id}>
                  <Popup
                    trigger={<button className="list-button"> {game.name} </button>}
                    modal
                    closeOnDocumentClick>
                    <div className='popup-info'>
                      <div className='list-info'>
                        <span>Name: <span style={{ color: 'black' }}>{game.name}</span></span><br />
                        <span>Platform: <span style={{ color: 'black' }}>{game.platform}</span></span><br />
                        <span>Genre: <span style={{ color: 'black' }}>{game.genre}</span></span><br />
                        <span>Release Date: <span style={{ color: 'black' }}>{moment(game.release_date, 'MM/DD/YYYY').format('MM/DD/YYYY')}</span></span><br />
                        <span>No. of Players: <span style={{ color: 'black' }}>{game.players}</span></span><br />
                        <span>Publisher: <span style={{ color: 'black' }}>{game.publisher}</span></span><br />
                      </div>
                      <Popup
                        trigger={<button className='button'> Edit </button>}
                        modal
                        closeOnDocumentClick>
                        <center>
                          Editing {game.name}
                          <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => this.handleChange('name', e)}
                          />
                          <input
                            type="text"
                            placeholder="Platform"
                            onChange={(e) => this.handleChange('platform', e)}
                          />
                          <input
                            type="text"
                            placeholder="Genre"
                            onChange={(e) => this.handleChange('genre', e)}
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
                            <input type="file" onChange={this.handleUpload} />
                          </span>
                          <button onClick={() => this.updateDB(game.id, this.state.name,
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
                      <button className='button' onClick={() => this.deleteFromDB(game.id)}>
                        Delete
                      </button>
                    </div>
                    <div className='box-art'>
                      <img src={game.box_art} alt="box_art" width='270' />
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