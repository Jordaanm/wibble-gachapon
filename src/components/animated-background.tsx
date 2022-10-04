import * as React from 'react';
import "./fancy.scss";

export const AnimatedBackground = () => {

  const arr = new Array(250).fill(0).map((_, b) => b);

  return <div className='background'>
    {/* {arr.map(x => <div className='circle-container'><div className='circle'></div></div>)} */}
    <div className="purple"></div>
    <div className="medium-blue"></div>
    <div className="light-blue"></div>
    <div className="red"></div>
    <div className="orange"></div>
    <div className="yellow"></div>
    <div className="cyan"></div>
    <div className="light-green"></div>
    <div className="lime"></div>
    <div className="magenta"></div>
    <div className="lightish-red"></div>
    <div className="pink"></div>
    <div className="gold"></div>
    <div className="goldenrod"></div>
  </div>
};

export const Bokeh = () => {
  return (
    <div className="bokeh">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}
