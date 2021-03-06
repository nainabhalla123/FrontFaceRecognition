import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';
import './App.css';



// const app=new Clarifai.App({
//   apiKey:'ca6b37d226244801953a1c32b24abad3'
// });



const particlesOptions = {
  //customize this to your liking
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

// const initialState = {
//   input: '',
//   imageUrl: '',
//   box: {},
//   route: 'signin',
//   isSignedIn: false,
//   user: {
//     id: '',
//     name: '',
//     email: '',
//     entries: 0,
//     joined: ''
//   }
// }

// class App extends Component {
//   constructor() {
//     super();
//     this.state = initialState;
//   }


class App extends Component{
  constructor(){
    super();
    this.state={ 
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
          id:'',
          name:'', 
          email:'',
          entries:0,        
          joined:''

      }
    }
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    //console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // onButtonSubmit = () => {
  //   this.setState({imageUrl: this.state.input});
  //     fetch('http://localhost:5000/imageurl', {
  //       method: 'post',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         input: this.state.input
  //       })
  //     })
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response) {
  //         fetch('http://localhost:5000/image', {
  //           method: 'put',
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({
  //             id: this.state.user.id
  //           })
  //         })
  //           .then(response => response.json())
  //           .then(count => {
  //             this.setState(Object.assign(this.state.user, { entries: count}))
  //           })
  //           .catch(console.log)

  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response))
  //     })
  //     .catch(err => console.log(err));
  // }

// onButtonSubmit=()=>{
//   this.setState({imageUrl:this.state.input});
//   app.models
//   .predict(
//    Clarifai.FACE_DETECT_MODEL,
//    this.state.input)
//   .then(response=>{
//     if(response){
//       fetch('http://localhost:5000/image',{
//          method:'put',
//          headers:{'Content-Type': 'application/json'},
//          body:JSON.stringify({
//          id:this.state.user.id
       
//       })
//       })
//       .then(response =>response.json())

//       .then(count =>{
//         this.setState(Object.assign(this.state.user,{entries:count}))
//       })
//     }
//     this.displayFaceBox(this.calculateFaceLocation(response))
//   })

//         //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        
//         .catch(err=>console.log(err)); 
//       }



 onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch(' https://thawing-beach-25493.herokuapp.com/imageUrl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(' https://thawing-beach-25493.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
        this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;