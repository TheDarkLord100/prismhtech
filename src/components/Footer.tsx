import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text py-8 mt-12">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8 px-4">
        <div className="col-span-3">
          <ThemeToggle />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Company Details</h3>
          <p>Some location text here...</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Products</h3>
          <ul>
            <li>Aluminum</li>
            <li>Benzoin</li>
            <li>Ethanol</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Social Media</h3>
          <p>Icons here...</p>
        </div>
      </div>
    </footer>
  );
}
