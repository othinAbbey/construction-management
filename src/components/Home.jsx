import React from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ImageSlider from "../components/Carousel";
import ActionCard from "../components/Home/ActionCard.jsx";

function Home() {
  const actionCardsData = [
    {
      icon: "item1.jpg",
      title: "Find Materials",
      shortDescription:
        "Locate the essential materials required for your upcountry contracts. Sourcing the right materials is crucial for your success as a contractor in remote areas.",
      fullDescription:
        "Locate the essential materials required for your upcountry contracts. As a contractor working in remote areas, sourcing the right materials is crucial for your success. Navigate through a variety of options and access quality materials to ensure the seamless execution of your projects.",
    },
    {
      icon: <UserCircleIcon />,
      title: "Calculate Materials Quantity",
      shortDescription:
        "Effortlessly estimate the quantity of materials needed for your upcountry projects. Avoid over-purchasing or running short on supplies.",
      fullDescription:
        "Effortlessly estimate the quantity of materials needed for your upcountry projects. Avoid over-purchasing or running short on supplies. Accurate calculations save you time and money, ensuring your construction or renovation work progresses smoothly.",
    },
    {
      icon: <PhotoIcon />,
      title: "Calculate Labor Costs",
      shortDescription:
        "Streamline your budget planning by calculating labor costs for your upcountry projects. Account for wages, hours worked, and project timelines.",
      fullDescription:
        "Streamline your budget planning by calculating labor costs for your upcountry projects. Account for wages, hours worked, and project timelines. Make informed decisions, optimize resources, and keep your projects within budget.",
    },
    {
      icon: <PhotoIcon />,
      title: "How It Works",
      shortDescription:
        "Discover the simplicity of our application. Learn how to efficiently manage your upcountry construction projects from start to finish.",
      fullDescription:
        "Discover the simplicity of our application. Learn how to efficiently manage your upcountry construction projects from start to finish. Explore our user-friendly features and step-by-step guides to master the tool and enhance your project management skills.",
    },
    {
      icon: <UserCircleIcon />,
      title: "Start Project",
      shortDescription:
        "Initiate a new project with confidence. Get started on your next endeavor, plan your tasks, and bring your ideas to life with ease.",
      fullDescription:
        "Initiate a new project with confidence. Get started on your next endeavor, plan your tasks, and bring your ideas to life with ease. Collaborate, organize, and innovate as you embark on your project journey. Your success story begins here.",
    },
    {
      icon: <PhotoIcon />,
      title: "Manage Project",
      shortDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule. Keep your team informed and engaged.",
      fullDescription:
        "Manage your projects with ease. Track your progress, monitor your budget, and stay on schedule. Keep your team informed and engaged. Make informed decisions and ensure your projects are completed on time and within budget.",
    },
    {
      icon: <PhotoIcon />,
      title: "Weather and Site Conditions",
      shortDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions. This comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges.",
      fullDescription:
        "Stay in control of your construction projects by keeping a close watch on weather and site conditions. This comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges. With real-time weather updates and site condition documentation, you can create a visual history of your project's progress and address potential challenges proactively.",
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
            description={cardData.description}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
