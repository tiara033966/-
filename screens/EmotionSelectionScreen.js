import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const EmotionSelectionScreen = ({ navigation, route }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const emotions = [
    { id: 1, name: '😊', symbol: '😊' },
    { id: 2, name: '😢', symbol: '😢' },
    { id: 3, name: '🫠', symbol: '🫠' },
    { id: 4, name: '😡', symbol: '😡' },
  ];

  const handleEmotionSelect = emotion => {
    setSelectedEmotion(emotion);
    navigation.navigate('DiaryScreen', { date: route.params.date, selectedEmotion });
  };

  return (
    <View style={styles.container}>
      <Text>Select an Emotion</Text>
      <FlatList
        data={emotions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEmotionSelect(item)}>
            <Text style={styles.emotionText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionText: {
    fontSize: 20,
    marginVertical: 8,
  },
});

export default EmotionSelectionScreen;
