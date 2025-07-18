import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Aura from "@primeuix/themes/aura";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");
