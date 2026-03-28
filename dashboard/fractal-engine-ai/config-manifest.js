export default {
  app: null,
  app_base_url: '/',
  app_api_url: '/fractal-engine-ai-service/api/v1',
  signup_api_url: `/fractal-engine-ai-service/api/v1/signup`,
  login_api_url: `/fractal-engine-ai-service/api/v1/session/login`,
  logout_api_url: `/fractal-engine-ai-service/api/v1/session/logout`,
  app_router_exception: [
    'wellcome',
    'profile',
  ],
  app_upload_file_url: '/fractal-engine-ai-service/api/v1/file',
  app_dashboard_type: location.hostname.split('.')[0],
  user_data: {},
  dashboard_full_content: false,
  session: null,
  is_light_theme: true,
}
