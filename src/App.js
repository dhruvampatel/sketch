import './App.css';
import Sketch from 'react-p5';
import {io} from 'socket.io-client';
import { useEffect } from 'react';

function App() {

  let height, width;
  useEffect(() => {
    width = document.getElementById('container').offsetWidth;
    height = document.getElementById('container').offsetHeight;
    console.log('Height: ', height);
    console.log('Width: ', width);
  },[]);

  const socket = io('http://localhost:4000');
  console.log(window.location.host);

  const setup = (p5, canvasParentRef) => {
		p5.createCanvas(width, height).parent(canvasParentRef);
    p5.background('rgba(0,0,0,0)');
    p5.fill(24);
    p5.strokeWeight(5);

    if(window.location.host === 'localhost:3000') return;

    socket.on('coords-receive', _data => {
      const data = JSON.parse(_data);
      //convert the percentage into pixels
      const getX = (width * data.percX) / 100;
      const getY = (height * data.percY) / 100;
      p5.point(getX, getY);
    });
	};

  const draw = (p5) => {

	};

  const mouseDragged = (p5) => {
    if(window.location.host !== 'localhost:3000') return;
    p5.point(p5.mouseX, p5.mouseY);

    //Get the percentage based on the width of current screen
    const getXForPatient = (p5.mouseX * 100) / width;
    const getYForPatient = (p5.mouseY * 100) / height;

    socket.emit('coords-send', JSON.stringify({
      x: p5.mouseX, 
      y: p5.mouseY, 
      percX: getXForPatient, 
      percY: getYForPatient
    }));
  }

  return (
    <div className="App" id='container' style={{
      backgroundImage: 'url(https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg)',
      backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      // minWidth: '100%',
      width: '100%',
      height: '100vh'
    }}>
      <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} />
    </div>
  );
}

export default App;
