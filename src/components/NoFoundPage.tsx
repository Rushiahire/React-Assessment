import "../styles/notFound.css";

const NotFoundPage = () => (
  <div className="notfound-container">
    <h1 className="notfound-title">404</h1>
    <p className="notfound-subtitle">Oops! Page Not Found</p>
    <p className="notfound-text">
      The page you're looking for doesn’t exist, has been moved, or is
      temporarily unavailable.
    </p>

    <a href="/" className="notfound-button">
      Back to Home
    </a>
  </div>
);

export default NotFoundPage;
