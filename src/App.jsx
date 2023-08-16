const AnotherComponent = () => {
  return (
    <div>
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.path}
          alt={icon.name}
          width="32"
          height="32"
        />
      ))}
    </div>
  );
};

export default AnotherComponent;
This example assumes that you have SVG icon files stored in an icons folder within your project directory. You would replace './icons/icon1.svg', './icons/icon2.svg', etc., with the actual paths to your icon files.

By creating an array of icons and importing them into other components, you can easily manage and use icons throughout your React application. This approach allows you to abstract away the details of individual icon paths and manage them more conveniently.





