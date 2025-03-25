const config = {
  env: {
    // Database
    databaseUrl: process.env.DATABASE_URL || '',

    // JWT Authentication
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiration: process.env.JWT_EXPIRATION || '1d',
    jwtRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY || '',

    // App URLs
    appUrl: process.env.NEXT_PUBLIC_URL || 'https://docta-app.vercel.app',
    appDomain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
    appScheme: process.env.NEXT_PUBLIC_SCHEME || 'https://',

    // Google OAuth
    googleScopes:
      process.env.NEXT_PUBLIC_GOOGLE_SCOPES ||
      'https://www.googleapis.com/auth/drive',
    oauth2Endpoint:
      process.env.NEXT_PUBLIC_OAUTH2_ENDPOINT ||
      'https://accounts.google.com/o/oauth2/v2/auth',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    oauth2RedirectUri:
      process.env.OAUTH2_REDIRECT_URI ||
      'http://localhost:5005/api/auth/callback/google',

    // Uploadcare
    uploadCareCssSrc:
      process.env.NEXT_PUBLIC_UPLOAD_CARE_CSS_SRC ||
      'https://cdn.jsdelivr.net/npm/@uploadcare/blocks@',
    uploadCareSrcPackage:
      process.env.NEXT_PUBLIC_UPLOAD_CARE_SRC_PACKAGE ||
      '/web/lr-file-uploader-regular.min.css',

    // Discord
    discordClientId: process.env.DISCORD_CLIENT_ID || '',
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    discordToken: process.env.DISCORD_TOKEN || '',
    discordPublickKey: process.env.DISCORD_PUBLICK_KEY || '',
    discordRedirect:
      process.env.NEXT_PUBLIC_DISCORD_REDIRECT ||
      'https://discord.com/oauth2/authorize?client_id=*CLIENTID*&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+guilds+connections+guilds.members.read+email+webhook.incoming',

    // Notion
    notionApiSecret: process.env.NOTION_API_SECRET || '',
    notionClientId: process.env.NOTION_CLIENT_ID || '',
    notionRedirectUri:
      process.env.NOTION_REDIRECT_URI ||
      'https://docta-app.vercel.app/api/auth/callback/notion',
    notionAuthUrl:
      process.env.NEXT_PUBLIC_NOTION_AUTH_URL ||
      'https://api.notion.com/v1/oauth/authorize?client_id=*CLIENTID*&response_type=code&owner=user&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fnotion',

    // Slack
    slackSigningSecret: process.env.SLACK_SIGNING_SECRET || '',
    slackBotToken: process.env.SLACK_BOT_TOKEN || '',
    slackAppToken: process.env.SLACK_APP_TOKEN || '',
    slackClientId: process.env.SLACK_CLIENT_ID || '',
    slackClientSecret: process.env.SLACK_CLIENT_SECRET || '',
    slackRedirectUri:
      process.env.SLACK_REDIRECT_URI ||
      'https://docta-app.vercel.app/api/auth/callback/slack',
    slackRedirect:
      process.env.NEXT_PUBLIC_SLACK_REDIRECT ||
      'https://slack.com/oauth/v2/authorize?client_id=*CLIENTID*&scope=chat:write,channels:read,groups:read,mpim:read,im:read&user_scope=chat:write,channels:read,groups:read,mpim:read,im:read&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fslack',

    // API
    apiUrl: process.env.API_URL || '',
    apiDomain: process.env.API_DOMAIN || '',

    // Misc
    cronJobKey: process.env.CRON_JOB_KEY || '',
    stripeSecret: process.env.STRIPE_SECRET || '',

    // Analytics
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXX',
  },
};

export default config;
