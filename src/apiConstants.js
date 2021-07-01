const apiConstant = {
  EditUserDetails: `api/v1/admin/editUserDetails`,
  GetUserList: `/api/v1/admin/listUsers?page=`,
  ChangeUserStatus: `/api/v1/admin/toggleUserStatus`,
  AddUser: `/api/v1/admin/addUser`,
  ViewUserDetails: `api/v1/admin/viewUserDetails`,
  GetUserProfile: `/api/v1/admin/getAdminProfile`,
  UpdateProfile: `/api/v1/admin/editProfile`,
  ForgotPassword: `/api/v1/admin/forgotPassword`,
  VerifyOtp: `/api/v1.0/VerifyOtp`,
  uploadImage: `/api/v1/admin/uploadImage`,
  ResetPassword: `/api/v1/admin/ResetPassword`,
  ChangePassword: `/api/v1/admin/changePassword`,
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
};

export default apiConstant;
