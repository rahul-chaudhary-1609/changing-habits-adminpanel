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
  deleteLearningContent: "/api/v1/admin/deleteLearningContent",
  deleteLearningQuiz: "/api/v1/admin/deleteQuiz",
  changeContentOrder: "/api/v1/admin/changeContentOrder",

  //food log category API's
  listFoodLogCategory: "/api/v1/admin/listFoodType",
  toggleFoodLogCategoryStatus: "/api/v1/admin/toggleFoodTypeStatus",
  listPhases: "/api/v1/admin/listPhases",
  getFoodLogCategory: "/api/v1/admin/getFoodType",
  addFoodLogCategory: "/api/v1/admin/addFoodType",
  editFoodLogCategory: "/api/v1/admin/editFoodType",
  deleteFoodLogCategory: "/api/v1/admin/deleteFoodType",

  //onboarding quiz management API's
  listOnboardingQuiz: "/api/v1/admin/listOnboardingQuiz",
  deleteOnboardingQuiz: "/api/v1/admin/deleteOnboardingQuiz",
  getOnboardingQuiz: "/api/v1/admin/getOnboardingQuiz",
  editOnboardingQuiz: "api/v1/admin/editOnboardingQuiz",
  addOnboardingQuiz: "api/v1/admin/addOnboardingQuiz",
  listQuizContentType: "/api/v1/admin/listQuizContentType",

  //knowledge center management API's
  listBlog: "/api/v1/admin/listBlog",
  deleteBlog: "/api/v1/admin/deleteBlog",
  getBlog: "/api/v1/admin/getBlog",
  editBlog: "api/v1/admin/editBlog",
  addBlog: "api/v1/admin/addBlog",
  listBlogContentType: "api/v1/admin/listBlogContentType",
  addBlogContentType: "api/v1/admin/addBlogContentType",

  //notification management API's
  listNotification: "/api/v1/admin/listNotification",
  sendNotification: "/api/v1/admin/sendNotification",
  listActiveUser: "/api/v1/admin/listActiveUsers",
  getNotification: "/api/v1/admin/getNotification",

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

  //user progress management API's
  listUser: "/api/v1/admin/listUsers",
  getUserProgress: "/api/v1/admin/getUserProgress",

  //informative slides API's
  listSlides: "/api/v1/admin/listSlides",
  deleteSlide: "/api/v1/admin/deleteSlide",
  getSectionList: "/api/v1/admin/getSlideCategoryList",
  changeSlideOrder: "/api/v1/admin/changeSlideOrder",
  getSlide: "/api/v1/admin/getSlide",
  addSection: "/api/v1/admin/addSlideCategory",
  addSlide: "/api/v1/admin/addSlide",
  editSlide: "/api/v1/admin/editSlide",

  //suggestion PDFs API's
  listSuggestionPdf: "/api/v1/admin/listSuggestionPdf",
  toggleSuggestionPdfStatus: "/api/v1/admin/toggleSuggestionPdfStatus",
  updateSuggestionPdf: "/api/v1/admin/updateSuggestionPdf",
};

export default apiConstant;
