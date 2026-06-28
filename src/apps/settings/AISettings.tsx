import { useState } from "react";
import { useAIConfig } from "@/os/context/AIConfigContext";
import { useShell } from "@/os/context/ShellContext";
import { useTheme } from "@/os/context/ThemeContext";
import type { AuthType, Provider } from "@/os/ai/types";

type Tab = "conta" | "ia";

function emptyProvider(): Provider {
  return {
    id: Math.random().toString(36).slice(2),
    name: "",
    baseUrl: "https://",
    authType: "bearer",
    apiKey: "",
    models: [],
    defaultModel: "",
  };
}

function AccountTab() {
  const { user, updateUser, osTheme, setOsTheme } = useTheme();
  const { notify } = useShell();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [email, setEmail] = useState(user.email);

  const save = () => {
    updateUser({ name, avatar, email });
    notify({ title: "Conta salva", variant: "success" });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <h2 className="text-base font-semibold">Conta</h2>

      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-inner">
          {avatar || "🦊"}
        </span>
        <label className="flex flex-1 flex-col gap-1 text-xs">
          <span className="text-muted-foreground">Avatar (emoji)</span>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="rounded-md bg-secondary p-2 text-sm outline-none"
            placeholder="🦊"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-muted-foreground">Nome</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md bg-secondary p-2 text-sm outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-muted-foreground">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md bg-secondary p-2 text-sm outline-none"
        />
      </label>

      <button
        onClick={save}
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Salvar conta
      </button>

      <hr className="border-white/10" />

      <h2 className="text-base font-semibold">Tema do Sistema</h2>

      <div className="flex gap-3">
        <button
          onClick={() => setOsTheme("bros")}
          className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
            osTheme === "bros"
              ? "border-[oklch(0.72_0.17_150)] bg-[oklch(0.72_0.17_150)/0.1]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex gap-1">
            <span className="text-lg">🍎</span>
            <span
              className="text-lg"
              style={{ filter: "drop-shadow(0 0 4px oklch(0.72 0.17 150 / 0.4))" }}
            >
              B
            </span>
          </div>
          <span className="text-sm font-semibold">BrOS</span>
          <span className="text-[10px] text-muted-foreground">Apple/iOS style, dock, glass</span>
        </button>

        <button
          onClick={() => setOsTheme("win11")}
          className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
            osTheme === "win11"
              ? "border-[oklch(0.62_0.18_240)] bg-[oklch(0.62_0.18_240)/0.1]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <span className="text-lg">⊞</span>
          <span className="text-sm font-semibold">Windows 11</span>
          <span className="text-[10px] text-muted-foreground">Taskbar, Start, desktop icons</span>
        </button>
      </div>
    </div>
  );
}

function ProvidersTab() {
  const { providers, upsertProvider, deleteProvider, defaultProviderId, setDefaultProvider } =
    useAIConfig();
  const { notify } = useShell();
  const [editing, setEditing] = useState<Provider | null>(null);
  const [modelsText, setModelsText] = useState("");

  function startEdit(p: Provider) {
    setEditing({ ...p });
    setModelsText(p.models.join("\n"));
  }
  function startNew() {
    const p = emptyProvider();
    setEditing(p);
    setModelsText("");
  }
  function save() {
    if (!editing) return;
    const models = modelsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const next: Provider = {
      ...editing,
      models,
      defaultModel:
        editing.defaultModel && models.includes(editing.defaultModel)
          ? editing.defaultModel
          : (models[0] ?? ""),
    };
    if (!next.name || !next.baseUrl) {
      notify({
        title: "Campos obrigatórios",
        message: "Nome e URL base são necessários.",
        variant: "warning",
      });
      return;
    }
    upsertProvider(next);
    setEditing(null);
    notify({ title: "Provider salvo", variant: "success" });
  }

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="flex flex-col border-r border-[color:var(--glass-border)]">
        <div className="flex items-center justify-between p-3">
          <h3 className="text-sm font-semibold">Providers</h3>
          <button
            onClick={startNew}
            className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
          >
            + Novo
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-auto px-2 pb-2">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => startEdit(p)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${editing?.id === p.id ? "bg-secondary" : "hover:bg-secondary/60"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name || "(sem nome)"}</span>
                {defaultProviderId === p.id && (
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                    padrão
                  </span>
                )}
              </div>
              <div className="line-clamp-1 text-xs text-muted-foreground">{p.baseUrl}</div>
              {!p.apiKey && <div className="text-[10px] text-yellow-400">sem chave</div>}
            </button>
          ))}
        </div>
      </aside>
      <section className="overflow-auto p-4">
        {editing ? (
          <div className="mx-auto flex max-w-xl flex-col gap-3">
            <h2 className="text-base font-semibold">Configurar provider</h2>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Nome</span>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="rounded-md bg-secondary p-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Base URL</span>
              <input
                value={editing.baseUrl}
                onChange={(e) => setEditing({ ...editing, baseUrl: e.target.value })}
                className="rounded-md bg-secondary p-2 text-sm outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted-foreground">Autenticação</span>
                <select
                  value={editing.authType}
                  onChange={(e) => setEditing({ ...editing, authType: e.target.value as AuthType })}
                  className="rounded-md bg-secondary p-2 text-sm outline-none"
                >
                  <option value="bearer">Bearer (Authorization)</option>
                  <option value="x-api-key">x-api-key</option>
                  <option value="none">Nenhuma</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted-foreground">API Key</span>
                <input
                  type="password"
                  value={editing.apiKey}
                  onChange={(e) => setEditing({ ...editing, apiKey: e.target.value })}
                  className="rounded-md bg-secondary p-2 text-sm outline-none"
                  placeholder="sk-..."
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Modelos (um por linha)</span>
              <textarea
                value={modelsText}
                onChange={(e) => setModelsText(e.target.value)}
                className="min-h-[120px] resize-none rounded-md bg-secondary p-2 font-mono text-xs outline-none"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">Modelo padrão</span>
              <input
                value={editing.defaultModel}
                onChange={(e) => setEditing({ ...editing, defaultModel: e.target.value })}
                className="rounded-md bg-secondary p-2 text-sm outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={save}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md bg-secondary px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              {providers.some((p) => p.id === editing.id) && (
                <>
                  <button
                    onClick={() => setDefaultProvider(editing.id)}
                    className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground"
                  >
                    Definir como padrão
                  </button>
                  <button
                    onClick={() => {
                      deleteProvider(editing.id);
                      setEditing(null);
                    }}
                    className="ml-auto rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-xl space-y-3 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">IA Settings</h2>
            <p>
              Configure provedores compatíveis com a API <code>/chat/completions</code> (OpenAI,
              Groq, Together, Mistral, etc.).
            </p>
            <p>
              Suas chaves ficam salvas localmente no seu navegador (localStorage). Elas nunca saem
              do seu dispositivo a não ser para o endpoint que você configurou.
            </p>
            <p>Selecione um provider à esquerda para editar, ou crie um novo.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function AISettings() {
  const [tab, setTab] = useState<Tab>("conta");

  return (
    <div className="flex h-full flex-col">
      {/* tabs */}
      <div className="flex shrink-0 gap-0 border-b border-white/10 px-4">
        <button
          onClick={() => setTab("conta")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "conta"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Conta
        </button>
        <button
          onClick={() => setTab("ia")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "ia"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          IA
        </button>
      </div>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "conta" ? <AccountTab /> : <ProvidersTab />}
      </div>
    </div>
  );
}
