// Index -> only this route this template has not archive records
// Record -> create routes with records and record
// Records -> create only records route

export default {
  AreaRecord: () => import('./template/area/index.vue'),
  CategoryRecord: () => import('./template/category/index.vue'),
  CustomEntityRecord: () => import('./template/custom-entity/index.vue'),
  CustomFieldRecord: () => import('./template/custom-field/index.vue'),
  CustomListRecord: () => import('./template/custom-list/index.vue'),
  CustomRecord: () => import('./template/custom-record/index.vue'),
  CustomRecords: () => import('./template/custom-records.vue'),
  DashboardIndex: () => import('./template/dashboard/index.vue'),
  FeedbackRecord: () => import('./template/feedback/index.vue'),
  FileRecord: () => import('./template/file/index.vue'),
  LanguageRecord: () => import('./template/language/index.vue'),
  LoginIndex: () => import('./template/login.vue'),
  NotFoundIndex: () => import('./template/not-found.vue'),
  ProfileIndex: () => import('./template/profile/index.vue'),
  Records: () => import('./template/records.vue'),
  ResourceRecord: () => import('./template/resource/index.vue'),
  RoleRecord: () => import('./template/role/index.vue'),
  SettingsIndex: () => import('./template/settings/index.vue'),
  SplashScreenIndex: () => import('./template/splash-screen.vue'),
  UserRecord: () => import('./template/user/index.vue'),
  WellcomeIndex: () => import('./template/wellcome.vue'),
}
