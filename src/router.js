import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
import AucationLayout from "./features/aucations/layouts/AucationLayout.vue";
import HomePage from "./features/aucations/pages/HomePage.vue";
import DetailPage from "./features/aucations/pages/DetailPage.vue";
import UsersPage from "./features/users/pages/UsersPage.vue";
import ProfilePage from "./features/users/pages/ProfilePage.vue";
import NotFoundPage from "./features/common/pages/NotFoundPage.vue";

export const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
      },
      {
        path: "register",
        name: "register",
        alias: ["registrasi", "/auth/registrasi"],
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/",
    component: AucationLayout,
    children: [
      {
        path: "",
        name: "home",
        alias: "aucations",
        component: HomePage,
      },
      {
        path: "aucations",
        name: "aucations",
        component: HomePage,
      },
      {
        path: "aucations/:id",
        name: "aucation-detail",
        component: DetailPage,
      },
      {
        path: "aucations/:aucationId",
        name: "aucation-detail-alt",
        component: DetailPage,
      },
      {
        path: "users",
        name: "users",
        component: UsersPage,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
  },
];

export function createAppRouter(history = createWebHistory()) {
  return createRouter({
    history,
    routes,
  });
}

const router = createAppRouter();

export default router;
