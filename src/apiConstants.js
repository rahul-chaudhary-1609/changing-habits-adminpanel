const apiConstant = {
  baseURL: "http://54.158.24.113/changinghabits",
  EditUserDetails: `api/v1/admin/editUserDetails`,
  GetUserList: `/api/v1/admin/listUsers?page=`,
  ChangeUserStatus: `/api/v1/admin/toggleUserStatus`,
  ToggleRecipeStatus: `/api/v1/admin/toggleRecipeStatus`,
  AddUser: `/api/v1/admin/addUser`,
  ViewUserDetails: `api/v1/admin/viewUserDetails`,
  GetUserProfile: `/api/v1/admin/getAdminProfile`,
  GetUserManagementDetails: `/api/v1/admin/viewUserDetails`,
  UpdateProfile: `/api/v1/admin/editProfile`,
  ForgotPassword: `/api/v1/admin/forgotPassword`,
  VerifyOtp: `/api/v1.0/VerifyOtp`,
  uploadImage: `/api/v1/admin/uploadImage`,
  ResetPassword: `/api/v1/admin/resetPassword`,
  ChangePassword: `/api/v1/admin/changePassword`,
  ChangeUserPassword: `/api/v1/admin/changeUserPassword`,
  Login: `/api/v1/admin/login`,
  GetRecipesList: `/api/v1/admin/listRecipes?page=`,
  DeleteRecipe: `/api/v1/admin/deleteRecipe`,
  AddRecipe: `/api/v1/admin/addRecipe`,
  EditRecipe: `/api/v1/admin/editRecipe`,
  GetRecipeDetail: `/api/v1/admin/getRecipe`,
  GetStaticContentList: `/api/v1/admin/getStaticContentList`,
  GetContentDetails: `/api/v1/admin/getStaticContentDetails`,
  updateStaticContent: `/api/v1/admin/editStaticContentDetails`,
  GetFaqs: "/api/v1/admin/getFaqs",
  DeleteFaq: "/api/v1/admin/deleteFaq",
  GetFaqById: "/api/v1/admin/getFaq",
  EditFaqs: "/api/v1/admin/editFaq",
  addFaq: "/api/v1/admin/addFaq",
  getTextFromHTML: "/api/v1/admin/htmlFileToText",
  ToggleFaqStatus: "/api/v1/admin/toggleFaqStatus",
  upgradeAppAccess: `/api/v1/admin/upgradeAppAccess`,

  //learnning content management API's
  listLearningContent: "/api/v1/admin/listLearningContent",
  toggleLearningContentStatus: "/api/v1/admin/toggleLearningContentStatus",
  listLearningQuiz: "/api/v1/admin/listQuiz",
  toggleLearningQuizStatus: "/api/v1/admin/toggleQuizStatus",
  getPhasedays: "/api/v1/admin/getPhaseDays",
  getLearningContent: "/api/v1/admin/getLearningContent",
  editLearningContent: "/api/v1/admin/editLearningContent",
  addLearningContent: "/api/v1/admin/addLearningContent",
  getLearningQuiz: "/api/v1/admin/getQuiz",
  editLearningQuiz: "/api/v1/admin/editQuiz",
  addLearningQuiz: "/api/v1/admin/addQuiz",

  //food log category API's
  listFoodLogCategory: "/api/v1/admin/listFoodType",
  toggleFoodLogCategoryStatus: "/api/v1/admin/toggleFoodTypeStatus",
  listPhases: "/api/v1/admin/listPhases",
  getFoodLogCategory: "/api/v1/admin/getFoodType",
  addFoodLogCategory: "/api/v1/admin/addFoodType",
  editFoodLogCategory: "/api/v1/admin/editFoodType",

  //onboarding quiz management API's
  listOnboardingQuiz: "/api/v1/admin/listOnboardingQuiz",
  deleteOnboardingQuiz: "/api/v1/admin/deleteOnboardingQuiz",
  getOnboardingQuiz: "/api/v1/admin/getOnboardingQuiz",
  editOnboardingQuiz: "api/v1/admin/editOnboardingQuiz",
  addOnboardingQuiz: "api/v1/admin/addOnboardingQuiz",
  
  //knowledge center management API's
  listBlog: "/api/v1/admin/listBlog",
  deleteBlog: "/api/v1/admin/deleteBlog",
  getBlog: "/api/v1/admin/getBlog",
  editBlog: "api/v1/admin/editBlog",
  addBlog: "api/v1/admin/addBlog",

  //notification management API's
  listNotification: "/api/v1/admin/listNotification",
  sendNotification: "/api/v1/admin/sendNotification",
  listUser: "/api/v1/admin/listActiveUsers",

  //food log suggestion API's
  listFoodLogSuggestion: "/api/v1/admin/listFoodContent",
  toggleFoodLogSuggestionStatus: "/api/v1/admin/toggleFoodContentStatus",
  getFoodLogSuggestion: "/api/v1/admin/getFoodContent",
  addFoodLogSuggestion: "/api/v1/admin/addFoodContent",
  editFoodLogSuggestion: "/api/v1/admin/editFoodContent",
  getFoodTypeByPhaseId: "/api/v1/admin/getFoodTypeByPhase",
  
  //weight gain reason management API's
  listReason: "/api/v1/admin/listReason",
  deleteReason: "/api/v1/admin/deleteReason",
  getReason: "/api/v1/admin/getReason",
  editReason: "api/v1/admin/editReason",
  addReason: "api/v1/admin/addReason",
};

export default apiConstant;
