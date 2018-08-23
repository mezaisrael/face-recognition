import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'a9b69599606d41bfb333ee4a81ce09b2'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      showBox: 'hidden',
      route: 'signin',
      isSignedIn: false,
      user: {
        // id: '',
        // name: '',
        // email: '',
        // password: '',
        // entries: 0,
        // joined: ''
      }
    }
  }

  loadUser = user => {
    this.setState({ user: user });
  }

  calculateFaceLocation = (data) => {
    console.log(data);
    const clarifaiBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');

    const imgWidth = Number(image.width); 
    const imgHeight = Number(image.height); 

    console.log(clarifaiBox.left_col, clarifaiBox.top_row);

    return {
      leftCol: clarifaiBox.left_col * imgWidth,
      rightCol: imgWidth - (clarifaiBox.right_col * imgWidth),
      topRow: clarifaiBox.top_row * imgHeight,
      bottomRow: imgHeight - (clarifaiBox.bottom_row * imgHeight),
    }
  }

  displayBox = (box) => {
    return this.setState({box: box, showBox: 'visible'});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input, showBox: 'hidden'});

    app.models
      .predict(
        "a403429f2ddf4b49b307e318f00e528b",
        this.state.input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({id:this.state.user.id})
          })
          .then(response => response.json())
          .then(user => {
            this.setState({user: user});
          });

        this.displayBox( this.calculateFaceLocation(response) )
        }//end if statement
      })
      .then(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signin') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render() {
    const {imageUrl, box, showBox, isSignedIn, route} = this.state; 
    let component;
   
    if(route === 'signin') {
      component = <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    } else if (route === 'home') {
      component = <div>
                    <Logo/>
                    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                    <ImageLinkForm
                    onChangeInput={this.onInputChange}
                    submit={this.onButtonSubmit}/>
                    <FaceRecognition imageUrl={imageUrl} box={box} showBox={showBox}/>
                  </div>
    } else if(route === 'register') {
      component = <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    }

    return (
      <div className="App">
        <Particles 
          className='particles'
          params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {component}
      </div>
    );
  }
}

export default App;
