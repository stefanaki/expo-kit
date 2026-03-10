export const el = {
  translation: {
    tabs: {
      home: 'Αρχική',
      details: 'Λεπτομέρειες',
      settings: 'Ρυθμίσεις',
    },
    common: {
      signIn: 'Σύνδεση',
      signOut: 'Αποσύνδεση',
      loading: 'Φόρτωση...',
    },
    auth: {
      signInTitle: 'Σύνδεση',
      signInSubtitle: 'Συνδεθείτε με τον λογαριασμό του οργανισμού σας για να συνεχίσετε.',
      signInFailed: 'Η ταυτοποίηση απέτυχε. Προσπαθήστε ξανά.',
      signInFailedShort: 'Η ταυτοποίηση απέτυχε.',
    },
    home: {
      screenTitle: 'Αρχική',
      welcome: 'Καλώς ήρθατε',
      description: 'Expo 55 scaffold με native tabs, Uniwind και ενεργοποιημένο React Compiler.',
      openDetails: 'Άνοιγμα Λεπτομερειών',
      openNewScreen: 'Άνοιγμα Νέας Οθόνης',
    },
    details: {
      screenTitle: 'Λεπτομέρειες',
    },
    stack: {
      newScreenTitle: 'Νέα Οθόνη',
    },
    newScreen: {
      loading: 'Φόρτωση...',
      errorLoadingData: 'Σφάλμα φόρτωσης δεδομένων',
      dataLabel: 'Δεδομένα: {{data}}',
    },
    settings: {
      screenTitle: 'Ρυθμίσεις',
      appearanceTitle: 'Εμφάνιση',
      currentMode: 'Τρέχουσα λειτουργία: {{mode}}',
      resolvedScheme: 'Ενεργό θέμα: {{scheme}}',
      toggleTheme: 'Εναλλαγή Θέματος',
      useSystemTheme: 'Χρήση Θέματος Συστήματος',
      accountTitle: 'Λογαριασμός',
      name: 'Όνομα: {{value}}',
      email: 'Email: {{value}}',
      sampleNumber: 'Δείγμα αριθμού: {{value}}',
      sampleCurrency: 'Δείγμα νομίσματος: {{value}}',
      sampleDate: 'Δείγμα ημερομηνίας: {{value}}',
      themeMode: {
        light: 'Ανοιχτό',
        dark: 'Σκούρο',
        system: 'Συστήματος',
      },
      colorScheme: {
        light: 'Ανοιχτό',
        dark: 'Σκούρο',
      },
    },
    notFound: {
      title: 'Ωχ!',
      message: 'Αυτή η οθόνη δεν υπάρχει.',
      cta: 'Μετάβαση στην αρχική οθόνη!',
    },
  },
} as const;
