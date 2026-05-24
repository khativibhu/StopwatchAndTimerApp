import { useEffect, useRef, useState } from "react";
import "./style.css";

function Stopwatch(){
    const [time, setTime] = useState(0);
    const stopwatchRef = useRef(0);
    const intervalRef = useRef(null);

    const needToResumeRef = useRef(false);
    
    function handleStart(){
      //prevent multiple intervals
      if(intervalRef.current) return;

      stopwatchRef.current = new Date().getTime() - time;

      intervalRef.current = setInterval(()=>{
        setTime(new Date().getTime() - stopwatchRef.current);
      },10);
    }

    function handlePause(){
     clearInterval(intervalRef.current);
     intervalRef.current = null;
    }

    function handleReset(){
     clearInterval(intervalRef.current);
     setTime(0);
     intervalRef.current = null;
    }

    function formatTime() {
        // 1 s -> 1000 ms   , 1234 ms -> (1234%1000) = 234 /10 = 23.4 -> Math.floor(23.4) = 23 ms

       const ms = Math.floor((time%1000) /10)
       .toString()
       .padStart(2,0);   //return 2 length string, and if length<2 , then pad 0 at start 
       const s = Math.floor((time/1000) % 60)
       .toString()
       .padStart(2,0); 
       const min = Math.floor((time/(1000 * 60) ) % 60)
       .toString()
       .padStart(2,0); 
       const h = Math.floor((time/(1000 * 60 *60) ))
       .toString()
       .padStart(2,0); 
       
       return `${h}:${min}:${s}:${ms}`;
    }
    
    useEffect(()=>{
      window.addEventListener("blur",handleBlur);
      window.addEventListener("focus",handleFocus);
        
        return () =>{
          window.removeEventListener("blur",handleBlur);
          window.removeEventListener("focus",handleFocus); 
        }
    },[time]);
     
    function handleBlur() {
       needToResumeRef.current = Boolean(intervalRef.current); 
       clearInterval(intervalRef.current);

       intervalRef.current = null;  //Without setting it to null, our Start protection may fail after tab switching.
    }

    function handleFocus() {
       if(needToResumeRef.current){ 
          needToResumeRef.current = false; 
          handleStart();
       }
    }

    return (
        <div className="stopwatch">
          <h2>StopWatch</h2>
          <span className="timer">{formatTime()}</span>  
          <div>
             <button onClick={handleStart}>Start</button>
             <button onClick={handlePause}>Pause</button>
             <button onClick={handleReset}>Reset</button>
          </div>
        </div>
    );
}

export default Stopwatch;