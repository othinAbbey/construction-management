// components/Footer.js

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full">
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
