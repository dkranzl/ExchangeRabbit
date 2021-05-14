declare var window: {[key: string]: {[key: string]: any}};

export const environment = {
  production: true,
  appUrl: window["env"]["appUrl"] || 'http://localhost:4200',
  peerjsHost: window["env"]["peerjsHost"] || 'localhost',
  peerjsPort: window["env"]["peerjsPort"] || 9000,
  peerjsPath: window["env"]["peerjsPath"] || '/myapp'
};
