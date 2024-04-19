import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarScreen from './screens/CalendarScreen';
import DiaryScreen from './screens/DiaryScreen';
import EmotionSelectionScreen from './screens/EmotionSelectionScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="EmotionSelection" component={EmotionSelectionScreen} />
        <Stack.Screen name="DiaryScreen" component={DiaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
