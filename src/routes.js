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
const ViewRecipe = React.lazy(() =>
  import("./views/recipeManagement/viewRecipe")
);
const User = React.lazy(() => import("./views/users/User"));
const EditUser = React.lazy(() => import("./views/users/editUser"));
const ChangeUserPassword = React.lazy(() =>
  import("./views/users/changeUserPassword")
);
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

const ListLearning = React.lazy(() =>
  import("./views/learningManagement/ListLearning")
);

const ViewLearningContent = React.lazy(() =>
  import("./views/learningManagement/ViewLearningContent")
);

const AddEditLearningContent = React.lazy(() =>
  import("./views/learningManagement/AddEditContent")
);

const AddEditLearningQuiz = React.lazy(() =>
  import("./views/learningManagement/AddEditQuiz")
);

const ViewLearningQuiz = React.lazy(() =>
  import("./views/learningManagement/ViewLearningQuiz")
);

const ListFoodLogCategory = React.lazy(() =>
  import("./views/foodLogManagement/ListCategory")
);

const AddEditFoodLogCategory = React.lazy(() =>
  import("./views/foodLogManagement/AddEditCategory")
);

const ViewFoodLogCategory = React.lazy(() =>
  import("./views/foodLogManagement/ViewCategory")
);

const ListOnboardingQuiz = React.lazy(() =>
  import("./views/onboardingQuizManagement/ListOnboardingQuiz")
);

const AddEditOnbordingQuiz = React.lazy(() =>
  import('./views/onboardingQuizManagement/AddEditOnboardingQuiz')
);

const ViewOnboardingQuiz = React.lazy(() =>
  import("./views/onboardingQuizManagement/ViewOnboardingQuiz")
);

const ListKnowledgeBlog = React.lazy(() =>
  import("./views/knowledgeCenterManagement/ListKnowledgeBlog")
);

const AddEditKnowledgeBlog = React.lazy(() =>
  import('./views/knowledgeCenterManagement/addEditKnowledgeBlog')
);

const ViewKnowledgeBlog = React.lazy(() =>
  import('./views/knowledgeCenterManagement/ViewKnowledgeBlog')
);

const ListNotification = React.lazy(() =>
  import("./views/notificationManagement/ListNotification")
);

const SendNotification = React.lazy(() =>
  import("./views/notificationManagement/SendNotification")
);

const ListUserProgress = React.lazy(() =>
  import("./views/UserProgressManagement/ListUserProgress")
);

const ListFoodLogSuggestion = React.lazy(() =>
  import("./views/foodLogManagement/ListSuggetion")
);

const AddEditFoodLogSuggestion = React.lazy(() =>
  import("./views/foodLogManagement/AddEditSuggestion")
)

const ViewFoodLogSuggestion = React.lazy(() =>
  import("./views/foodLogManagement/ViewSuggestion")
);

const ListWeightGainReason = React.lazy(() =>
  import("./views/weightGainReasonManagement/ListWeightGainReason")
);

const AddEditWeightGainReason = React.lazy(() =>
  import("./views/weightGainReasonManagement/AddEditWeightGainReason")
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
  {
    path: "/viewRecipe/:id",
    exact: true,
    name: "View User",
    component: ViewRecipe,
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
    path: "/editUser/:id/changePassword",
    exact: true,
    name: "Change User Pass",
    component: ChangeUserPassword,
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
  {
    path: `/listLearning/:type`,
    exact: true,
    name: "List Learning",
    component: ListLearning,
  },
  {
    path: `/viewLearningContent/:id`,
    exact: true,
    name: "View Learning Content",
    component: ViewLearningContent,
  },
  {
    path: `/addLearningContent`,
    exact: true,
    name: "Add Learning Content",
    component: AddEditLearningContent,
  },

  {
    path: `/editLearningContent/:id`,
    exact: true,
    name: "Edit Learning Content",
    component: AddEditLearningContent,
  },
  {
    path: `/viewLearningQuiz/:id`,
    exact: true,
    name: "View Learning Quiz",
    component: ViewLearningQuiz,
  },

  {
    path: `/addLearningQuiz`,
    exact: true,
    name: "Add Learning Quiz",
    component: AddEditLearningQuiz,
  },
  {
    path: `/editLearningQuiz/:id`,
    exact: true,
    name: "Edit Learning Quiz",
    component: AddEditLearningQuiz,
  },

  {
    path: `/listFoodLogCategory`,
    exact: true,
    name: "List Food Log Category",
    component: ListFoodLogCategory,
  },
  {
    path: `/viewFoodLogCategory/:id`,
    exact: true,
    name: "View Food Log Category",
    component: ViewFoodLogCategory,
  },

  {
    path: `/addFoodLogCategory`,
    exact: true,
    name: "Add Food Log Category",
    component: AddEditFoodLogCategory,
  },

  {
    path: `/editFoodLogCategory/:id`,
    exact: true,
    name: "Edit Food Log Category",
    component: AddEditFoodLogCategory,
  },

  {
    path: `/listOnboardingQuiz`,
    exact: true,
    name: "List Onboarding Quiz",
    component: ListOnboardingQuiz,
  },
    
  {
    path: `/viewOnboardingQuiz/:id`,
    exact: true,
    name: "View Onboarding Quiz",
    component: ViewOnboardingQuiz,
  },
    
  {
    path: `/addOnboardingQuiz`,
    exact: true,
    name: "Add Onboarding Quiz",
    component: AddEditOnbordingQuiz,
  },

  {
    path: `/editOnboardingQuiz/:id`,
    exact: true,
    name: "Edit Onboarding Quiz",
    component: AddEditOnbordingQuiz,
  },

  {
    path: `/listKnowledgeBlog`,
    exact: true,
    name: "List Knowledge Blog",
    component: ListKnowledgeBlog,
  },
  {
    path: `/viewKnowledgeBlog/:id`,
    exact: true,
    name: "View Knowledge Blog",
    component: ViewKnowledgeBlog,
  },
   {
    path: `/addKnowledgeBlog`,
    exact: true,
    name: "Add Knowledge Blog",
    component: AddEditKnowledgeBlog,
  },

  {
    path: `/editKnowledgeBlog/:id`,
    exact: true,
    name: "Edit Knowledge Blog",
    component: AddEditKnowledgeBlog,
  },

   {
    path: `/listNotification`,
    exact: true,
    name: "List Notification",
    component: ListNotification,
  },
   
  {
    path: `/sendNotification`,
    exact: true,
    name: "Send Notification",
    component: SendNotification,
  },

  {
    path: `/listUserProgress`,
    exact: true,
    name: "List User Progress",
    component: ListUserProgress,
  },


  {
    path: `/listFoodLogSuggestion`,
    exact: true,
    name: "List Food Log Suggestion",
    component: ListFoodLogSuggestion,
  },

  {
    path: `/viewFoodLogSuggestion/:id`,
    exact: true,
    name: "View Food Log Suggestion",
    component: ViewFoodLogSuggestion,
  },

  {
    path: `/editFoodLogSuggestion/:id`,
    exact: true,
    name: "Edit Food Log Category",
    component: AddEditFoodLogSuggestion,
  },

  {
    path: `/addFoodLogSuggestion`,
    exact: true,
    name: "Add Food Log Suggestion",
    component: AddEditFoodLogSuggestion,
  },

  {
    path: `/listWeightGainReason`,
    exact: true,
    name: "List Weight Gain Reason",
    component: ListWeightGainReason,
  },

  {
    path: `/viewWeightGainReason/:id`,
    exact: true,
    name: "View Weight Gain Reason",
    component: ViewFoodLogSuggestion,
  },

  {
    path: `/editWeightGainReason/:id`,
    exact: true,
    name: "Edit Weight Gain Reason",
    component: AddEditWeightGainReason,
  },

  {
    path: `/addWeightGainReason`,
    exact: true,
    name: "Add Weight Gain Reason",
    component: AddEditWeightGainReason,
  },

  { component: Page404 },
];

export default routes;
