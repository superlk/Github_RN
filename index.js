/**
 * @format
 */

import {AppRegistry} from 'react-native';
import AppNavigator from './js/navigator/AppNavigator';
import WelcomePage from './js/page/WelcomePage';
import App from './js/App'
import {name as appName} from './app.json';


// AppRegistry.registerComponent(appName, () => AppNavigator);
AppRegistry.registerComponent(appName, () => App);
