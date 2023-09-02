import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.css";
function ImageSlider() {
  const carouselProps = {
    showThumbs: false,
  };
  return (
    <Carousel {...carouselProps}>
      <div className="image-slider">
        <img
          src="src/assets/Image/DSC_0007.JPG"
          alt="Image 1"
          width="50%"
          height="300px"
        />
      </div>
      <div>
        <img
          src="src/assets/Image/2965dfbb-289a-4805-87f2-6e444cd79069.jpg"
          alt="Image 2"
          width="50%"
          height="300px"
        />
      </div>
      <div>
        <img
          src="src/assets/Image/DSC_0009.JPG"
          alt="Image 3"
          width="50%"
          height="300px"
        />
      </div>
    </Carousel>
  );
}

export default ImageSlider;
