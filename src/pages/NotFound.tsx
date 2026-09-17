import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="not-found shell">
      <p>404</p>
      <h1 tabIndex={-1}>
        That page took
        <br />a different path.
      </h1>
      <p>The link may have changed. The projects and writing are still here.</p>
      <div>
        <Link className="button-primary" to="/">
          Back home
        </Link>
        <Link className="button-secondary" to="/projects">
          Explore projects
        </Link>
      </div>
    </section>
  );
}
