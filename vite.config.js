import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ex_index: resolve(__dirname, "ex/index.html"),
        ex_login: resolve(__dirname, "ex/login.html"),
        ex_signup: resolve(__dirname, "ex/signup.html"),
        ex_forgot: resolve(__dirname, "ex/forgot-password.html"),
        ex_reset: resolve(__dirname, "ex/reset-password.html"),
        ex_dashboard: resolve(__dirname, "ex/dashboard.html"),
        ex_timetable: resolve(__dirname, "ex/timetable.html"),
        ex_workspace: resolve(__dirname, "ex/workspace.html"),
        ex_pastpapers: resolve(__dirname, "ex/pastpapers.html"),
        ex_supercurricular: resolve(__dirname, "ex/supercurricular.html"),
        ex_countdown: resolve(__dirname, "ex/countdown.html"),
        ex_payment: resolve(__dirname, "ex/payment.html"),
        ex_onboarding: resolve(__dirname, "ex/onboarding.html"),
        ex_classbooking: resolve(__dirname, "ex/class-booking.html"),
        ex_terms: resolve(__dirname, "ex/terms.html"),
      },
    },
  },
});
