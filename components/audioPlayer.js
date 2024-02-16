// import React, { useRef, useEffect ,useState} from "react";

// export default function AudioPlayer(props) {
// const [isPlaying, setIsPlaying] = useState(false); // State to track audio play/pause
//   const audio = useRef(null);

//   const playPromise = audio.current.play();

//   useEffect(() => {
//     if (props.isPlaying) {
//       setIsPlaying(false);
//     } else {
//        setIsPlaying(true);
//     }
//   }, [props.play]);// Update the state when the play prop changes


//   if (playPromise !== undefined) {
//     playPromise
//       .then((_) => {

//         // Automatic playback started!
//         // Show playing UI.
//       })
//       .catch((error) => {
//         // Auto-play was prevented
//         // Show paused UI.
//       });
//   }
// // const playAudio = () => { 
// //     console.log(isPlaying);
// //     if (isPlaying) {
// //       audio.current.play();// Play the audio
// //     } else {
// //       audio.current.pause();// Pause the audio
// //     }

// //     setIsPlaying(!isPlaying); // Toggle the state to update the button text
// //   };
  


//   return (
//     <div>
//       <audio ref={audio} >
//         <source src={"http://stream1.slowradio.com"} type="audio/mp3" />
//         Your browser does not support the audio element.
//       </audio>
//       <button onClick={playAudio}>{isPlaying ? "Play":"Pause"}</button>
//     </div>
//   );
// }


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
      pauseAudio();
    } else {
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audio}>
        <source src={"http://stream1.slowradio.com"} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={handleButtonClick}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

