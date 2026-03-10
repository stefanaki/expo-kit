jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(insets),
    SafeAreaView: ({ children, ...props }) =>
      React.createElement('View', props, children),
    SafeAreaListener: ({ children }) => children,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
    initialWindowMetrics: { insets, frame: { x: 0, y: 0, width: 375, height: 812 } },
  };
});

jest.mock('@rn-primitives/portal', () => {
  const React = require('react');
  return {
    PortalHost: () => null,
    Portal: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock('uniwind', () => ({
  Uniwind: { setTheme: jest.fn(), updateInsets: jest.fn() },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: null,
      accuracy: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 0,
  }),
  watchPositionAsync: jest.fn().mockReturnValue({ remove: jest.fn() }),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
}));

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn().mockResolvedValue('mocked-digest'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256', SHA1: 'SHA-1', MD5: 'MD5' },
  randomUUID: jest.fn(() => 'test-uuid-1234'),
}));

jest.mock('@maplibre/maplibre-react-native', () => {
  const React = require('react');
  const NullComponent = (name) => (props) =>
    React.createElement(name, { testID: props.testID });
  return {
    MapView: NullComponent('MapView'),
    Camera: NullComponent('Camera'),
    PointAnnotation: NullComponent('PointAnnotation'),
    ShapeSource: NullComponent('ShapeSource'),
    FillLayer: NullComponent('FillLayer'),
    LineLayer: NullComponent('LineLayer'),
    SymbolLayer: NullComponent('SymbolLayer'),
    setAccessToken: jest.fn(),
  };
});
