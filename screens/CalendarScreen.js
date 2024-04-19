import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, Theme } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  
  const navigation = useNavigation();

  const handleDatePress = date => {
    setSelectedDate(date.dateString);
    navigation.navigate('EmotionSelection', { date: date.dateString });
  };

  const calendarTheme = {
    textSectionTitleColor: '#A2886D',
    dayTextColor: '#EBDAC8',
    todayTextColor: '#013E41',
    selectedDayTextColor: '#8D91AA',
    selectedDayBackgroundColor: 'orange',
    arrowColor: 'orange',
    monthTextColor: '#8D91AA',
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDatePress}
        theme={calendarTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

});

export default CalendarScreen;
