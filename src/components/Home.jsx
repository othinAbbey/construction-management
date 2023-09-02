import React from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ImageSlider from "../components/Carousel";
function Home() {
  return (
    <div className="home">
      <ImageSlider className="slider" />
    </div>
  );
}
export default Home;
