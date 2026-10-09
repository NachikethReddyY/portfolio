import { Link } from "react-router-dom";
import { RecoveryArtwork } from "../components/RecoveryArtwork";
import { Arrow } from "../components/Icons";

export default function NotFound() {
  return (
    <section className="missing-page shell" aria-labelledby="missing-title">
      <RecoveryArtwork />
      <div className="missing-copy">
        <p className="missing-status">404 / Not found</p>
        <h1 id="missing-title" tabIndex={-1}>
          Page not found<span>.</span>
        </h1>
        <p>This link may have moved, or the page doesn’t exist.</p>
        <div className="missing-actions">
          <Link className="button-primary" to="/">
            Back home <Arrow />
          </Link>
          <Link className="missing-projects" to="/projects">
            View projects <Arrow diagonal />
          </Link>
        </div>
      </div>
    </section>
  );
}
