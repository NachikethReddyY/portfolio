export function LocalModelDemo() {
  return (
    <figure className="local-workspace" aria-label="Sample Ollama conversation">
      <div className="ollama-window">
        <div className="ollama-toolbar">
          <span className="window-controls" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>gemma2</span>
        </div>
        <div className="ollama-session">
          <div className="ollama-identity">
            <img src="/icons/ollama.svg" alt="" />
            <strong>Ollama</strong>
          </div>
          <p className="ollama-question">Explain this interface.</p>
          <div className="ollama-answer">
            <img src="/icons/ollama.svg" alt="" />
            <p>
              You’re chatting with a model running on your computer. Write a
              message, choose a model, and keep the conversation going.
            </p>
          </div>
          <div className="ollama-composer" aria-hidden="true">
            <span>Send a message</span>
            <span>↑</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
