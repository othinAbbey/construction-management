// import React from "react";

// export const About = () => {
//   const siteSimplify = [
//     {
//       title: "About Us",
//       description:
//         "Welcome to C & A Contractors Limited, your trusted partner in construction project management. Our mission is to simplify and streamline the construction process for contractors working in remote and upcountry areas. With years of experience and a deep understanding of the unique challenges faced by contractors, we've developed a comprehensive suite of tools and features designed to empower your projects.",
//     },
//     {
//       title: "Who We Are",
//       description:
//         "At C & A Contractors Limited, we're a team of dedicated professionals passionate about construction and project management. We understand that success in remote and upcountry construction relies on efficient resource management, precise planning, and real-time information. That's why we created this platform to to equip contractors like you with the tools needed to succeed.",
//     },
//     {
//       title: "Our Vision",
//       description:
//         "Our vision is to revolutionize the construction industry by providing innovative solutions tailored to the specific needs of contractors operating in challenging environments. We believe in the power of technology to simplify complex tasks, improve decision-making, and enhance project outcomes.",
//     },
//     {
//       title: "What We Offer",
//       description: `
//           <ul>
//             <li><strong>Material Sourcing:</strong> Our platform helps you locate essential materials required for your upcountry contracts. We know that sourcing the right materials is crucial for your success.</li>
//             <li><strong>Labor Cost Calculation:</strong> Streamline your budget planning by accurately estimating labor costs for your projects. Make informed decisions and keep your projects within budget.</li>
//             <li><strong>Project Management:</strong> Manage your projects with ease. Track progress, monitor budgets, and stay on schedule. Keep your team informed and engaged for successful project completion.</li>
//             <li><strong>Weather and Site Conditions:</strong> Stay in control of your construction projects by keeping a close watch on weather and site conditions. Our comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges.</li>
//           </ul>
//         `,
//     },

//     {
//       title: "Why Choose us",
//       description:
//         "Expertise: Our team consists of experts in both construction and technology, ensuring you receive the best solutions. User-Friendly: Our platform is designed with simplicity in mind. You don't need to be a tech expert to use our tools effectively. Affordable: We offer cost-effective solutions to help you maximize your project's return on investment.",
//     },
//     {
//       title: "Get Started Today",
//       description:
//         "Join the growing community of contractors who have transformed their construction projects with [Your Website Name]. We're here to support your success every step of the way. Ready to get started? Explore our tools, and let's build a brighter future together.",
//     },
//   ];
//   return siteSimplify.map((item, index) => (
//     <div key={index}>
//       <br />
//       <h1>{item.title}</h1>
//       <br />
//       <p>{item.description}</p>
//     </div>
//   ));
// };

import React from "react";

export const About = () => {
  const siteSimplify = [
    {
      title: "About Us",
      description:
        "Welcome to C & A Contractors Limited, your trusted partner in construction project management. Our mission is to simplify and streamline the construction process for contractors working in remote and upcountry areas. With years of experience and a deep understanding of the unique challenges faced by contractors, we've developed a comprehensive suite of tools and features designed to empower your projects.",
    },
    {
      title: "Who We Are",
      description:
        "At C & A Contractors Limited, we're a team of dedicated professionals passionate about construction and project management. We understand that success in remote and upcountry construction relies on efficient resource management, precise planning, and real-time information. That's why we created this platform to equip contractors like you with the tools needed to succeed.",
    },
    {
      title: "Our Vision",
      description:
        "Our vision is to revolutionize the construction industry by providing innovative solutions tailored to the specific needs of contractors operating in challenging environments. We believe in the power of technology to simplify complex tasks, improve decision-making, and enhance project outcomes.",
    },
    {
      title: "What We Offer",
      description: `
        <ul>
          <li><strong>Material Sourcing:</strong> Our platform helps you locate essential materials required for your upcountry contracts. We know that sourcing the right materials is crucial for your success.</li>
          <li><strong>Labor Cost Calculation:</strong> Streamline your budget planning by accurately estimating labor costs for your projects. Make informed decisions and keep your projects within budget.</li>
          <li><strong>Project Management:</strong> Manage your projects with ease. Track progress, monitor budgets, and stay on schedule. Keep your team informed and engaged for successful project completion.</li>
          <li><strong>Weather and Site Conditions:</strong> Stay in control of your construction projects by keeping a close watch on weather and site conditions. Our comprehensive feature offers you the tools you need to effectively manage environmental factors and site-specific challenges.</li>
        </ul>
      `,
    },
    {
      title: "Why Choose Us",
      description:
        "Expertise: Our team consists of experts in both construction and technology, ensuring you receive the best solutions. User-Friendly: Our platform is designed with simplicity in mind. You don't need to be a tech expert to use our tools effectively. Affordable: We offer cost-effective solutions to help you maximize your project's return on investment.",
    },
    {
      title: `Get Started Today`,
      description:
        "Join the growing community of contractors who have transformed their construction projects with [Your Website Name]. We're here to support your success every step of the way. Ready to get started? Explore our tools, and let's build a brighter future together.",
    },
  ];

  return siteSimplify.map((item, index) => (
    <div key={index}>
      <br />
      <h1>
        <strong>{item.title}</strong>
      </h1>
      <br />
      {item.title === "What We Offer" ? (
        <p dangerouslySetInnerHTML={{ __html: item.description }} />
      ) : (
        <p>{item.description}</p>
      )}
      <br />
    </div>
  ));
};
