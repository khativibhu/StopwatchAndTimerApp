import { useState , useRef} from "react";
import "./style.css";

const TimeFactors = {
    Hour: 'hh',
    Minute: 'mm',
    Seconds: 'ss',
    MilliSeconds: 'ms'
};

const Config = {
    [TimeFactors.Hour] : {
        value: "", //initial value
        factor: 60 * 60 * 1000 , //hour will convert into millisec 
        placeholder: 'HH' 
    },
    [TimeFactors.Seconds]: {
        value: "",
        factor: 1000,
        placeholder: 'SS'
    },
    [TimeFactors.Minute]: {
        value: "",
        factor: 60*1000,
        placeholder: 'MM'
    }
};

const OrderOfTime = [TimeFactors.Hour,TimeFactors.Minute,TimeFactors.Seconds];

function Timer() {
    const [config, setConfig] = useState(structuredClone(Config));
    const [time, setTime] = useState(0);

    const intervalRef = useRef(null);
    const timeSpentRef = useRef(0);

    function handleChange({ key }){

      return (event) => { 
      const newConfig = structuredClone(config);
      newConfig[key].value = event.target.value;
      setConfig(newConfig);
      
      };
    }


    function handleStart() {
    
    // prevent multiple intervals   //prevents glitch issue when we click Start multiple times. Without it, every time we click Start, a new interval gets created.
    if (intervalRef.current) return;

     //convert entered time in milli seconds
    let totalTimeInMilliSeconds = time;
    
    // If timer hasn't started yet, calculate from inputs
  if (totalTimeInMilliSeconds <= 0) {

    OrderOfTime.forEach((key) => {
        const data = config[key];

        const value = data.value;
        const factor = data.factor;
       
        if(value && !isNaN(value)){
            totalTimeInMilliSeconds += Number(value) * factor;
        }
    });

   }

    //start the timer
    //10:10(current time)  + 10 min  = 10:20(current time) . Now, if actual current time <= currentTime , then keep updating timer 
    timeSpentRef.current = Date.now() + totalTimeInMilliSeconds;
    
    intervalRef.current = setInterval(()=>{
        const remainingTime = timeSpentRef.current - new Date().getTime() ;
        
        if(remainingTime <=0){
            handleReset();
            return;
        }
        
        setTime(remainingTime);
    }, 10); 

    }

    function handlePause() {
     clearInterval(intervalRef.current);
     intervalRef.current = null;
    }

    function handleReset(){
     clearInterval(intervalRef.current);
     intervalRef.current = null;
     setTime(0);
     timeSpentRef.current = 0;
     setConfig(structuredClone(Config));   
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


    return (
    <div className="timer">

        <h2>Timer</h2>
      <div className="text-fields">
        {OrderOfTime.map((orderKey, index) => {

            const data = config[orderKey];
            
            return (<div key={orderKey}>
               <input type="text" value={data.value} placeholder={data.placeholder} onChange={handleChange({key: orderKey, index})}/>
            </div>);
        })}
      </div>
{formatTime()}
      <div className="buttons">
         <button onClick={handleStart}>&#x23F5; Start</button>
         <button onClick={handlePause}>&#x23F8; Pause</button>
         <button onClick={handleReset}>&#x23FB; Reset</button>
      </div>
    </div>
    );
}

export default Timer;