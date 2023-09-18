import React, { useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ActionCard from "../components/Home/ActionCard.jsx";

function Home() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFullDescription = (index) => {
    const updatedCardsData = [...actionCardsData];
    updatedCardsData[index].showFullDescription =
      !updatedCardsData[index].showFullDescription;
    setActionCardsData(updatedCardsData);
  };

  const actionCardsData = [
    {
      icon: (
        <img
          src="../src/assets/Image/Bricks.jpg"
          alt="Materials"
          // className="max-w-xs"
          class="sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-10 xl:h-10"
        />
      ),
      title: "Find Materials",
      shortDescription:
        "Locate the essential materials required for your upcountry contracts. ",
      fullDescription:
        "Locate the essential materials required for your upcountry contracts.  As a contractor working in remote areas, sourcing the right materials is crucial for your success. Navigate through a variety of options and access quality materials to ensure the seamless execution of your projects.",
      showFullDescription: false,
    },
    {
      icon: <UserCircleIcon />,
      title: "Calculate Materials Quantity",
      shortDescription:
        "Effortlessly estimate the quantity of materials needed for your projects. ",
      fullDescription:
        "Effortlessly estimate the quantity of materials needed for your projects. Avoid over-purchasing or running short on supplies. Accurate calculations save you time and money, ensuring your construction or renovation work progresses smoothly.",
      showFullDescription: false,
    },
    {
      icon: <PhotoIcon />,
      title: "Calculate Labor Costs",
      shortDescription:
        "Streamline your budget planning by calculating labor costs for your projects.",
      fullDescription:
        "Streamline your budget planning by calculating labor costs for your projects. Account for wages, hours worked, and project timelines. Make informed decisions, optimize resources, and keep your projects within budget.",
      showFullDescription: false,
    },
    {
      icon: <PhotoIcon />,
      title: "How It Works",
      shortDescription: "Discover the simplicity of our application. ",
      fullDescription:
        "Discover the simplicity of our application. Efficiently manage your construction projects from start to finish. Explore our user-friendly features and step-by-step guides to master the tool and enhance your project management skills.",
      showFullDescription: false,
    },
    {
      icon: <UserCircleIcon />,
      title: "Start Project",
      shortDescription: "Initiate a new project with confidence.",
      fullDescription:
        "Initiate a new project with confidence. Get started on your next endeavor, plan your tasks, and bring your ideas to life with ease. Collaborate, organize, and innovate as you embark on your project journey. Your success story begins here.",
      showFullDescription: false,
    },
    {
      icon: <PhotoIcon />,
      title: "Manage Project",
      shortDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule.",
      fullDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule. Keep your team informed and engaged. Make informed decisions and ensure your projects are completed on time and within budget.",
      showFullDescription: false,
    },
    {
      icon: <PhotoIcon />,
      title: "Weather and Site Conditions",
      shortDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions.",
      fullDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions. This comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges. With real-time weather updates and site condition documentation, you can create a visual history of your project's progress and address potential challenges proactively.",
      showFullDescription: false,
    },
  ];

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
        {actionCardsData.map((cardData, index) => (
          <ActionCard
            key={index}
            icon={cardData.icon}
            title={cardData.title}
            shortDescription={cardData.shortDescription}
            fullDescription={cardData.fullDescription}
            // showFullDescription={cardData.showFullDescription}
          />
        ))}
        {/* <button onClick={toggleFullDescription}>
          {showFullDescription ? "Read Less" : "Read More"}
        </button> */}
      </div>
    </div>
  );
}
export default Home;
