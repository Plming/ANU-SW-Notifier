declare namespace NodeJS {
    interface ProcessEnv {
        SLACK_WEBHOOK_URL: string;
        MONGODB_URI: string;
    }
}
