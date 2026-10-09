import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient, useCurrentUser } from "sanity";
import type { Tool } from "sanity";
import { portfolioSchema } from "../content/validation";
import seed from "../content/seed.json";
import { resolveSiteUrl } from "../content/site";
import {
  createStarterDocuments,
  selectMissingStarterDocuments,
} from "./starterContent";
import type { StarterDocument, ExistingDocumentRecord } from "./starterContent";
import styles from "./StarterContentTool.module.css";

const starters = createStarterDocuments(portfolioSchema.parse(seed));
type Props = {
  dataset: string;
  editor: string;
  loadExisting: () => Promise<ExistingDocumentRecord[]>;
  createDrafts: (documents: StarterDocument[]) => Promise<void>;
};

export function StarterContentPanel({
  dataset,
  editor,
  loadExisting,
  createDrafts,
}: Props) {
  const [existing, setExisting] = useState<ExistingDocumentRecord[] | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const missing = useMemo(
    () => (existing ? selectMissingStarterDocuments(starters, existing) : []),
    [existing],
  );
  const refresh = useCallback(async () => {
    setError("");
    try {
      setExisting([...(await loadExisting())]);
    } catch {
      setError(
        "Could not check this dataset. Check your connection and editor access, then try again.",
      );
    }
  }, [loadExisting]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function create() {
    if (!confirmed || busy || !missing.length) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      // Re-check immediately before writing to preserve newly created content.
      const current = await loadExisting();
      const pending = selectMissingStarterDocuments(starters, current);
      if (pending.length) await createDrafts(pending);
      setExisting([...(await loadExisting())]);
      setConfirmed(false);
      setNotice(
        pending.length
          ? pending.length +
              " starter drafts are ready. Open Content → Current content to review and publish them individually."
          : "Everything is already present. No documents were changed.",
      );
    } catch {
      setError(
        "The import did not finish. Existing documents are preserved; refresh and retry to create only what is still missing.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Content setup</p>
          <h1>Your portfolio, ready to edit.</h1>
          <p>
            Bring the website’s starter content into Sanity as drafts, then make
            it yours.
          </p>
        </div>
        <a
          href={resolveSiteUrl(import.meta.env.VITE_SITE_URL)}
          target="_blank"
          rel="noreferrer"
        >
          Open portfolio ↗
        </a>
      </header>
      <div className={styles.meta}>
        <span>
          Dataset <strong>{dataset}</strong>
        </span>
        <span>
          Signed in as <strong>{editor}</strong>
        </span>
      </div>
      <section className={styles.summary} aria-label="Starter content summary">
        {[
          ["profile", "Profile"],
          ["caseStudy", "Case studies"],
          ["article", "Articles"],
          ["experience", "Experience"],
        ].map(([type, label]) => (
          <div key={type}>
            <strong>
              {starters.filter((doc) => doc._type === type).length}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <section className={styles.action}>
        <h2>
          {existing === null
            ? error
              ? "Content status unavailable"
              : "Checking your content…"
            : missing.length
              ? missing.length + " drafts can be added"
              : "Your starter content is already here"}
        </h2>
        <p>
          This creates missing drafts only. Existing edits and published
          documents stay intact. Your live website changes only when you publish
          a document from the content editor.
        </p>
        <p className={styles.note}>
          The original LAH article and other legacy documents remain under
          Content → Existing content.
        </p>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className={styles.notice}>
            {notice}
          </p>
        )}
        {existing !== null && missing.length > 0 && (
          <label className={styles.confirm}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={busy}
            />
            <span>
              Create {missing.length} unpublished drafts in{" "}
              <strong>{dataset}</strong>.
            </span>
          </label>
        )}
        <div className={styles.buttons}>
          <button
            onClick={() => void create()}
            disabled={!confirmed || busy || !missing.length}
          >
            {busy ? "Creating drafts…" : "Create missing drafts"}
          </button>
          <button
            className={styles.secondary}
            onClick={() => void refresh()}
            disabled={busy}
          >
            Refresh content status
          </button>
        </div>
      </section>
      <section className={styles.inventory}>
        <h2>What’s included</h2>
        <p>
          Review the titles before importing. Each document can be edited or
          discarded before publication.
        </p>
        <ul>
          {starters.map((document) => (
            <li key={document._id}>
              <span>
                {String(
                  document.name ??
                    document.title ??
                    document.organization ??
                    document._type,
                )}
              </span>
              <small>
                {existing === null
                  ? "Checking"
                  : missing.some((item) => item._id === document._id)
                    ? "New draft"
                    : "Already present"}
              </small>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.help}>
        <h2>After editing</h2>
        <p>
          Publish from the Content tab. The website loads published changes
          automatically. A new Vercel build refreshes the search and sharing
          previews too.
        </p>
        <p>
          To keep those previews current, connect a Sanity publish webhook to a
          Vercel deploy hook in your account settings.
        </p>
      </section>
    </main>
  );
}

export default function StarterContentTool() {
  const baseClient = useClient({ apiVersion: "2026-09-17" });
  const client = useMemo(
    () => baseClient.withConfig({ useCdn: false, perspective: "raw" }),
    [baseClient],
  );
  const user = useCurrentUser();
  const loadExisting = useCallback(
    () =>
      client.fetch<ExistingDocumentRecord[]>(
        '*[_type in ["profile", "caseStudy", "article", "experience"]]{_id,_type,slug,id}',
      ),
    [client],
  );
  const createDrafts = useCallback(
    async (documents: StarterDocument[]) => {
      const transaction = client.transaction();
      documents.forEach((document) => transaction.createIfNotExists(document));
      await transaction.commit();
    },
    [client],
  );
  return (
    <StarterContentPanel
      dataset={client.config().dataset ?? "production"}
      editor={user?.name ?? "Editor"}
      loadExisting={loadExisting}
      createDrafts={createDrafts}
    />
  );
}
export const starterContentTool: Tool = {
  name: "setup",
  title: "Content setup",
  component: StarterContentTool,
};
