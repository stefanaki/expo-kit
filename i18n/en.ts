export const en = {
  translation: {
    tabs: {
      home: 'Home',
      details: 'Details',
      settings: 'Settings',
    },
    common: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      loading: 'Loading...',
    },
    auth: {
      signInTitle: 'Sign in',
      signInSubtitle: 'Sign in with your organization account to continue.',
      signInFailed: 'Authentication failed. Please try again.',
      signInFailedShort: 'Authentication failed.',
    },
    home: {
      screenTitle: 'Home',
      welcome: 'Welcome',
      description: 'Expo 55 scaffold with native tabs, Uniwind, and React Compiler enabled.',
      openDetails: 'Open Details',
      openNewScreen: 'Open New Screen',
    },
    details: {
      screenTitle: 'Details',
    },
    stack: {
      newScreenTitle: 'New Screen',
    },
    newScreen: {
      loading: 'Loading...',
      errorLoadingData: 'Error loading data',
      dataLabel: 'Data: {{data}}',
    },
    settings: {
      screenTitle: 'Settings',
      appearanceTitle: 'Appearance',
      currentMode: 'Current mode: {{mode}}',
      resolvedScheme: 'Resolved scheme: {{scheme}}',
      toggleTheme: 'Toggle Theme',
      useSystemTheme: 'Use System Theme',
      accountTitle: 'Account',
      name: 'Name: {{value}}',
      email: 'Email: {{value}}',
      sampleNumber: 'Sample number: {{value}}',
      sampleCurrency: 'Sample currency: {{value}}',
      sampleDate: 'Sample date: {{value}}',
      themeMode: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      colorScheme: {
        light: 'Light',
        dark: 'Dark',
      },
    },
    notFound: {
      title: 'Oops!',
      message: "This screen doesn't exist.",
      cta: 'Go to home screen!',
    },
  },
} as const;
