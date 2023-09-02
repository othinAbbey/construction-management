import "./Materials.css";
import { useClickOutside } from "@mantine/hooks";
import { useState } from "react";
import SiteLocation from "../components/MaterialsCalc/SiteLocation.jsx";
import MaterialCard from "./MaterialsCalc/MaterialCard";

function Materials() {
  const items = [
    {
      Size: "Item 1",
      imageSrc: "item1.jpg",
      itemType: "Item 2",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 2",
      imageSrc: "item2.jpg",
      itemType: "Item 3",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 3",
      imageSrc: "item3.jpg",
      itemType: "Item 4",
      quantity: <input type="number" placeholder="Quantity" />,
    },
    {
      Size: "Item 4",
      imageSrc: "item4.jpg",
      itemType: "Item 5",
      quantity: <input type="number" placeholder="Quantity" />,
    },
  ];
  return (
    <div>
      <SiteLocation />
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
