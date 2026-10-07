import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import AucationLayout from "./features/aucations/layouts/AucationLayout.vue";

const LoginPage = () => import("./features/auth/pages/LoginPage.vue");
const RegisterPage = () => import("./features/auth/pages/RegisterPage.vue");
const HomePage = () => import("./features/aucations/pages/HomePage.vue");
const DetailPage = () => import("./features/aucations/pages/DetailPage.vue");
const UsersPage = () => import("./features/users/pages/UsersPage.vue");
const ProfilePage = () => import("./features/users/pages/ProfilePage.vue");
const NotFoundPage = () => import("./features/common/pages/NotFoundPage.vue");

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
