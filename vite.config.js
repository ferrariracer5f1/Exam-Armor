import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ex: resolve(__dirname, "ex/index.html"),
        login: resolve(__dirname, "ex/login.html"),
        signup: resolve(__dirname, "ex/signup.html"),
        forgot: resolve(__dirname, "ex/forgot-password.html"),
        reset: resolve(__dirname, "ex/reset-password.html"),
        dashboard: resolve(__dirname, "ex/dashboard.html"),
        timetable: resolve(__dirname, "ex/timetable.html"),
        workspace: resolve(__dirname, "ex/workspace.html"),
        pastpapers: resolve(__dirname, "ex/pastpapers.html"),
        supercurricular: resolve(__dirname, "ex/supercurricular.html"),
        countdown: resolve(__dirname, "ex/countdown.html"),
        payment: resolve(__dirname, "ex/payment.html"),
        onboarding: resolve(__dirname, "ex/onboarding.html"),
        classbooking: resolve(__dirname, "ex/class-booking.html"),
        terms: resolve(__dirname, "ex/terms.html"),
      },
    },
  },
});
