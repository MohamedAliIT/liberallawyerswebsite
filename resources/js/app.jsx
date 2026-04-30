// resources/js/app.jsx
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/app.css";
import "./bootstrap";
import { router } from '@inertiajs/react';
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME ;

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    ),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: "#4B5563",
  },
});



let el = null;
router.on('start', () => {
  if (!el) {
    el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset-inline-start:1rem;top:1rem;background:#2563eb;color:#fff;padding:.4rem .7rem;border-radius:.6rem;z-index:9999;font:500 13px system-ui';
    el.textContent = 'جارٍ التحديث…';
    document.body.appendChild(el);
  }
});
router.on('finish', () => {
  if (el) { el.remove(); el = null; }
});
