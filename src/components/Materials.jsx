import "./Materials.css";
import { useClickOutside } from "@mantine/hooks";
import { useState } from "react";
import SiteLocation from "../components/MaterialsCalc/SiteLocation.jsx";
import MaterialCard from "./MaterialsCalc/MaterialCard";
import MinorNav from "./minorNav";

function Materials() {
  const items = [
    {
      Size: "Item 1",
      imageSrc: "item1.jpg",
      itemType: "Item 1",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 2",
      imageSrc: "item2.jpg",
      itemType: "Item 2",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 3",
      imageSrc: "item3.jpg",
      itemType: "Item 3",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 4",
      imageSrc: "item4.jpg",
      itemType: "Item 4",
      quantity: <input type="number" placeholder="Quantity" />,
    },
  ];
  const works = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Masonry",
    "Painting",
    "Welding",
    "Roofing",
    "Tiling",
    "Plastering",
    "Concrete",
    "Steel",
    "Glass",
    "Aluminium",
  ];

  const Equipment = [
    "Cement Mixer",
    "Concrete Mixer",
    "Concrete Vibrator",
    "Concrete Cutter",
    "Concrete Pump",
    "Concrete Buggy",
    "Excavator",
    "Backhoe",
    "Bulldozer",
    "Skid Steer Loader",
    "Trencher",
    "Loader",
    "Grader",
    "Scraper",
  ];
  return (
    <div>
      <SiteLocation />
      <MinorNav items={works} className="works" />
      <div className="Material-List">
        {items.map((item, index) => (
          <MaterialCard
            key={index}
            Size={item.Size}
            imageSrc={item.imageSrc}
            itemType={item.itemType}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  );
}
export default Materials;
