// Home.jsx

import React from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ActionCard from "../components/Home/ActionCard.jsx";
import "./home.css"; // Make sure the path to your CSS file is correct
import Slider from "react-slick";

function Home() {
  const actionCardsData = [
    {
      icon: (
        <img
          src="../src/assets/Image/Bricks.jpg"
          alt="Materials"
          className="icon"
        />
      ),
      title: "Find Materials",
      shortDescription:
        "Locate the essential materials required for your upcountry contracts.",
      fullDescription:
        "Locate the essential materials required for your upcountry contracts. As a contractor working in remote areas, sourcing the right materials is crucial for your success. Navigate through a variety of options and access quality materials to ensure the seamless execution of your projects.",
    },
    {
      icon: <UserCircleIcon />,
      title: "Calculate Materials Quantity",
      shortDescription:
        "Effortlessly estimate the quantity of materials needed for your projects.",
      fullDescription:
        "Effortlessly estimate the quantity of materials needed for your projects. Avoid over-purchasing or running short on supplies. Accurate calculations save you time and money, ensuring your construction or renovation work progresses smoothly.",
    },
    {
      icon: <PhotoIcon />,
      title: "Calculate Labor Costs",
      shortDescription:
        "Streamline your budget planning by calculating labor costs for your projects.",
      fullDescription:
        "Streamline your budget planning by calculating labor costs for your projects. Account for wages, hours worked, and project timelines. Make informed decisions, optimize resources, and keep your projects within budget.",
    },
    {
      icon: <PhotoIcon />,
      title: "How It Works",
      shortDescription: "Discover the simplicity of our application.",
      fullDescription:
        "Discover the simplicity of our application. Efficiently manage your construction projects from start to finish. Explore our user-friendly features and step-by-step guides to master the tool and enhance your project management skills.",
    },
    {
      icon: <UserCircleIcon />,
      title: "Start Project",
      shortDescription: "Initiate a new project with confidence.",
      fullDescription:
        "Initiate a new project with confidence. Get started on your next endeavor, plan your tasks, and bring your ideas to life with ease. Collaborate, organize, and innovate as you embark on your project journey. Your success story begins here.",
    },
    {
      icon: <PhotoIcon />,
      title: "Manage Project",
      shortDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule.",
      fullDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule. Keep your team informed and engaged. Make informed decisions and ensure your projects are completed on time and within budget.",
    },
    {
      icon: <PhotoIcon />,
      title: "Weather and Site Conditions",
      shortDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions.",
      fullDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions. This comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges. With real-time weather updates and site condition documentation, you can create a visual history of your project's progress and address potential challenges proactively.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  // Slice the actionCardsData array to display only the first 5 cards
  const displayedActionCards = actionCardsData.slice(0, 5);

  return (
    <div className="home">
      <h1>Welcome to Your Construction Project Management Hub Site Simplify</h1>
      <p>
        Empower your construction projects with our comprehensive suite of tools
        and features designed to simplify project management and enhance your
        success in remote and upcountry areas. Explore the following key
        functionalities:
      </p>
      <br />
      <div className="Material-List">
        {displayedActionCards.map((cardData, index) => (
          <ActionCard
            key={index}
            icon={cardData.icon}
            title={cardData.title}
            shortDescription={cardData.shortDescription}
            fullDescription={cardData.fullDescription}
          />
        ))}
      </div>
      {/* Use the Slider component for the remaining action cards */}
      <Slider {...sliderSettings}>
        {actionCardsData.slice(5).map((cardData, index) => (
          <ActionCard
            key={index + 5} // Add an offset to avoid key conflicts
            icon={cardData.icon}
            title={cardData.title}
            shortDescription={cardData.shortDescription}
            fullDescription={cardData.fullDescription}
          />
        ))}
      </Slider>
    </div>
  );
}

export default Home;
