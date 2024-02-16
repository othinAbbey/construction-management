

import React, { useRef, useEffect, useState } from "react";

export default function AudioPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false); // State to track audio play/pause
  const audio = useRef(null);

  useEffect(() => {
    // Update the state when the play prop changes
    if (props.isPlaying) {
      setIsPlaying(true);
      playAudio();
    } else {
      setIsPlaying(false);
      pauseAudio();
    }
  }, [props.isPlaying]);

  const playAudio = () => {
    const playPromise = audio.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
  };

  const pauseAudio = () => {
    audio.current.pause();
  };

  const handleButtonClick = () => {
    if (isPlaying) {
        console.log("audio paused")
      pauseAudio();
    } else {
        console.log("audio playing")
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audio}>
        <source src="http://stream1.slowradio.com" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={handleButtonClick}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

