import React, { useRef, useEffect ,useState} from "react";

export default function AudioPlayer(props) {
const [isPlaying, setIsPlaying] = useState(false); // State to track audio play/pause
  const audio = useRef(null);

  useEffect(() => {
    if (props.isPlaying) {
      setIsPlaying(false);
    } else {
       setIsPlaying(true);
    }
  }, [props.play]);// Update the state when the play prop changes

const playAudio = () => { 
    console.log(isPlaying);
    if (isPlaying) {
      audio.current.play();// Play the audio
    } else {
      audio.current.pause();// Pause the audio
    }

    setIsPlaying(!isPlaying); // Toggle the state to update the button text
  };
  


  return (
    <div>
      <audio ref={audio} >
        <source src={"http://stream1.slowradio.com"} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={playAudio}>{isPlaying ? "Play":"Pause"}</button>
    </div>
  );
}

