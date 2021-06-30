import React from "react";
import AddRecipe from "./views/recipeManagement/addRecipe";

const UpdateEmail = React.lazy(() =>
  import("./views/adminProfile/updateEmailOtp")
);
const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const NewUsers = React.lazy(() => import("./views/users/newUsers"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

const RecipeManagement = React.lazy(() =>
  import("./views/recipeManagement/recipes")
);
const RecipeAdd = React.lazy(() =>
  import("./views/recipeManagement/addRecipe")
);
const User = React.lazy(() => import("./views/users/User"));
const EditUser = React.lazy(() => import("./views/users/editUser"));
const ChangePassword = React.lazy(() =>
  import("./views/changePassword/changePassword")
);
const AdminProfile = React.lazy(() =>
  import("./views/adminProfile/adminProfile")
);

const EditAdmin = React.lazy(() => import("./views/adminProfile/editAdmin"));

const StaticContent = React.lazy(() =>
  import("./views/staticContentManagement/staticContent")
);
const ViewStaticContent = React.lazy(() =>
  import("./views/staticContentManagement/viewStaticContent/viewStaticContent")
);
const EditStaticContent = React.lazy(() =>
  import("./views/staticContentManagement/editStaticContent/editStaticContent")
);
const AddFaqs = React.lazy(() =>
  import("./views/staticContentManagement/Faqs/addFqs/addFaqs")
);
const FAQS = React.lazy(() =>
  import("./views/staticContentManagement/viewStaticContent/faqQ")
);
const EditFqs = React.lazy(() =>
  import("./views/staticContentManagement/Faqs/editFaqs/editFaqs")
);

const routes = [
  { path: "/", exact: true, name: "Users", component: User },
  { path: "/theme", name: "Theme", component: Colors, exact: true },
  { path: "/theme/colors", name: "Colors", component: Colors },
  {
    path: "/recipeManagement",
    exact: true,
    name: "RecipeManagement",
    component: RecipeManagement,
  },
  {
    path: "/addrecipe",
    exact: true,
    name: "Add Recipe",
    component: RecipeAdd,
  },
  {
    path: "/addrecipe/:id",
    exact: true,
    name: "Add User",
    component: RecipeAdd,
  },
  { path: "/users", exact: true, name: "Users", component: NewUsers },
  {
    path: "/categorytypemanagement",
    exact: true,
    name: "Category",
    component: "",
  },

  { path: "/user/:id", exact: true, name: "User Details", component: User },
  {
    path: "/editUser/:id",
    exact: true,
    name: "Edit User",
    component: EditUser,
  },
  {
    path: "/addUser",
    exact: true,
    name: "Edit User",
    component: EditUser,
  },
  {
    path: "/changePassword",
    exact: true,
    name: "Change Password",
    component: ChangePassword,
  },
  { path: "/profile", exact: true, name: "Profile", component: AdminProfile },

  { path: "/editAdmin", exact: true, name: "Edit Admin", component: EditAdmin },
  {
    path: "/updateEmail",
    exact: true,
    name: "Edit Admin",
    component: UpdateEmail,
  },
  {
    path: "/static",
    exact: true,
    name: "StaticContent",
    component: StaticContent,
  },
  {
    path: `/viewStaticContent/:id`,
    exact: true,
    name: "View Content",
    component: ViewStaticContent,
  },
  {
    path: [
      `/viewStaticContent/:id/faqs`,
      `/viewStaticContent/:id/faqs/:topicid`,
    ],
    exact: true,
    name: "FAQS",
    component: FAQS,
  },
  {
    path: `/editStaticContent/:id`,
    exact: true,
    name: "Edit Content",
    component: EditStaticContent,
  },
  {
    path: `/viewStaticContent/:id/addFaqs`,
    exact: true,
    name: "Add Faqs",
    component: AddFaqs,
  },
  {
    path: `/viewStaticContent/:id/faqs/:questionId/editFaqs/`,
    exact: true,
    name: "Edit Faqs",
    component: EditFqs,
  },

  { component: Page404 },
];

export default routes;
