import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker, setupConnectionListeners } from "./registerSW";

// Registrar Service Worker para PWA
registerServiceWorker();

// Configurar listeners de conexão
setupConnectionListeners(
  () => {
    console.log("Aplicação online");
  },
  () => {
    console.log("Aplicação offline - modo offline ativado");
  }
);

createRoot(document.getElementById("root")!).render(<App />);
