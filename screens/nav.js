import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}
export function openDrawer(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.current.openDrawer(name, params);
  }
}
