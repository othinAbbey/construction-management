// components/Footer.js

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-1 text-center  w-full">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} C & A Contractors Limited. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
