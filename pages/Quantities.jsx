import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Input } from "postcss";

function Quantities() {
    const Materials=[
    {image:"/images/brick.jpg",name:"Bricks",quantity:"1000", type:"Bricks",unit:"pcs",price:"1000",total:"1000000"},
    {image:'/images/blocks.jpg',name:'Blocks',type:'Solid',size: '100 X 200 X 400',quantity:Input},
    {image:'/images/solid.jpg',name:'Solid Blocks',type:'Solid',size: '200 X 200 X 400',quantity:Input},
    {image:'/images/hollow.jpg',name:'Hollow Blocks',type:'Hollow',size: '200 X 200 X 400',quantity:Input},
    {image:'/images/solid.jpg',name:'Solid Blocks',type:'Hollow',size: '150 X 200 X 400',quantity:Input},


    ]
  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
   <h1>Quantities</h1>
   <h2>SITE LOCATION</h2>
   </div>
  );
}

export default Quantities;
