class SDKKeyCenter {
  static const int appID = int.fromEnvironment('ZEGO_APP_ID', defaultValue: 0);
  static const String appSign = String.fromEnvironment('ZEGO_APP_SIGN');
  static const String serverSecret = String.fromEnvironment('ZEGO_SERVER_SECRET');
}
