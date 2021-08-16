import './App.css';
import Sketch from 'react-p5';
import {io} from 'socket.io-client';
import { useEffect, useRef } from 'react';

function App() {

  const height = useRef();
  const width = useRef();
  useEffect(() => {
    width.current = document.getElementById('container').offsetWidth;
    height.current = document.getElementById('container').offsetHeight;
    console.log('Height: ', height.current);
    console.log('Width: ', width.current);
  },[]);

  const socket = io('http://localhost:4000');
  console.log(window.location.host);

  const setup = (p5, canvasParentRef) => {
		p5.createCanvas(width.current, height.current).parent(canvasParentRef);
    p5.background('rgba(0,0,0,0)');
    p5.fill(24);
    p5.strokeWeight(5);

    //Code executes on patient side only
    if(window.location.host === 'localhost:3000') return;

    socket.on('coords-receive', _data => {
      const data = JSON.parse(_data);
      //convert the percentage into pixels
      const getX = (width.current * data.percX) / 100;
      const getY = (height.current * data.percY) / 100;
      p5.point(getX, getY);
    });
	};

  const draw = (p5) => {

	};

  const mouseDragged = (p5) => {
    //Code executes on practioner side only
    if(window.location.host !== 'localhost:3000') return;
    p5.point(p5.mouseX, p5.mouseY);

    //Get the percentage based on the width of current screen
    const getXForPatient = (p5.mouseX * 100) / width.current;
    const getYForPatient = (p5.mouseY * 100) / height.current;

    socket.emit('coords-send', JSON.stringify({
      x: p5.mouseX, 
      y: p5.mouseY, 
      percX: 100 - getXForPatient, //Subtracting from 100 because the image is going to have mirror effect in video chat
      percY: getYForPatient
    }));
  }

  return (
    <div className="App" id='container' style={{
      backgroundImage: window.location.host === 'localhost:3000' ?
        'url(https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg)' : 
        'url(https://i.imgur.com/Ofu3v4t.jpeg)',
      backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      minWidth: '100%',
      maxWidth: '100%',
      width: '100%',
      height: '100vh',
    }}>
      <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} />
    </div>
  );
}

export default App;
