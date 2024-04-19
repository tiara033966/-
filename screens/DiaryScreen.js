import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';


const DiaryScreen = ({ route }) => {
  const { date,selectedEmotion} = route.params;
  const [diaryText, setDiaryText] = useState('');
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  useEffect(() => {
    
    const loadDiary = async () => {
      try {
        const savedDiary = await AsyncStorage.getItem('diary');
        if (savedDiary !== null) {
          setDiaryText(savedDiary);
          setEntries(savedDiary.split('\n'));
        }
      } catch (error) {
        console.error('Error loading diary:', error);
      }
    };

    loadDiary();

    return () => {
      // Cleanup effect
    };
  }, []);
  
  const handleDiaryChange = async (text) => {
    setDiaryText(text);

    try {
      await AsyncStorage.setItem('diary', text);
    } catch (error) {
      console.error('Error saving diary:', error);
    }
  };

  const handleDiarySubmit = async () => {
    if (diaryText.trim() !== '') {
      const newEntry = `Weather: ${selectedWeather}\n${diaryText.trim()}`;
      const updatedDiary = `${diaryText.trim()}\n${newEntry}`;
  
      setEntries((prevEntries) => [...prevEntries, newEntry]);
      setDiaryText('');
  
      try {
        await AsyncStorage.setItem('diary', updatedDiary);
      } catch (error) {
        console.error('Error saving diary:', error);
      }
    }
  };
  
  const handleEditEntry = (index) => {
    console.log('Editing entry at index:', index);
    setEditIndex(index);
    
    const entryParts = entries[index].split('\n');
    const weatherMatch = entryParts[0].match(/Weather:\s(\w+)/i);
    const weather = weatherMatch ? weatherMatch[1] : '';
    console.log('Selected weather:', weather);
    setSelectedWeather(weather);
    
    const text = entryParts[1] || '';
    console.log('Diary text:', text);
    setDiaryText(text);
  };

  const handleSaveEdit = async () => {
    if (editIndex !== null && diaryText.trim() !== '') {
      const updatedEntries = [...entries];
      const updatedEntry = `Weather:${selectedWeather}\n${diaryText.trim()}`;
      updatedEntries[editIndex] = updatedEntry;
  
      const updatedDiary = updatedEntries.join('\n');
  
      try {
        await AsyncStorage.setItem('diary', updatedDiary);
  
        setEntries(updatedEntries);
        setDiaryText('');
        setEditIndex(null);
        setSelectedWeather('');
      } catch (error) {
        console.error('Error saving edited diary entry:', error);
      }
    }
  };
  
  

  const handleToggleSelection = (index) => {
    const isSelected = selectedEntries.includes(index);
    if (isSelected) {
      setSelectedEntries((prevSelection) => prevSelection.filter((item) => item !== index));
    } else {
      setSelectedEntries((prevSelection) => [...prevSelection, index]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEntries.length > 0) {
      const updatedEntries = entries.filter((_, index) => !selectedEntries.includes(index));
      const updatedDiary = updatedEntries.join('\n');

      try {
        await AsyncStorage.setItem('diary', updatedDiary);

        setEntries(updatedEntries);
        setSelectedEntries([]);
      } catch (error) {
        console.error('Error deleting selected diary entries:', error);
      }
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleWeatherSelect = (weather) => {
    setSelectedWeather(weather);
    toggleModal();
  };
  const getWeatherFromEntry = (entry) => {
    const match = entry.match(/Weather:\s(\w+)/i);
    return match ? match[1] : ''; // 返回匹配到的天氣信息，如果沒有找到，返回空字符串
  };
  
  
  
  const WeatherImage = ({ weather }) => {
    //console.log('Current weather:', weather); // 添加這行日誌
    switch (weather.toLowerCase()) {
      case 'Sunny':
        return <Image source={require('./sunny.png')} style={styles.weatherImage} />;
      case 'Rainy':
        return <Image source={require('./RAINY.png')} style={styles.weatherImage} />;
      case 'Cloudy':
        return <Image source={require('./Cloudy.png')} style={styles.weatherImage} />;
      default:
        return null;
    }    
    };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {selectedEmotion && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.emotionSymbol}>{selectedEmotion.symbol}</Text>
          <Text >{date}</Text>
        </View>
      )}
    </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.diaryInput}
          multiline
          placeholder="Start writing something..."
          value={diaryText}
          onChangeText={handleDiaryChange}
        />
      </View>
      <View style={styles.weatherContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDiarySubmit}>
              <Text style={styles.buttonText}>sent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>choose weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDeleteSelected}>
              <Text style={styles.buttonText}>delete</Text>
        </TouchableOpacity> 
      </View>
      <View style={styles.buttonContainer}>
      </View>
      <ScrollView
        style={styles.diaryContainer}
        contentContainerStyle={styles.diaryContentContainer}
      >
       {entries.map((entry, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.entryContainer,
            selectedEntries.includes(index) && styles.selectedEntry,
          ]}
          onPress={() => handleToggleSelection(index)}
        >
          <View style={styles.entryContainer}>
            {/* 其他日记内容 */}
            <Text style={styles.entryText}>{entry}</Text>
            {/* 编辑按钮 */}
            <TouchableOpacity onPress={() => handleEditEntry(index)}>
              <Text style={styles.editButton}>編輯</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSaveEdit()}>
            <Text style={styles.editButton}>保存</Text>
            </TouchableOpacity>
          </View>
          
          <WeatherImage weather={getWeatherFromEntry(entry)} />
        </TouchableOpacity>
      ))}

    
      </ScrollView>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => handleWeatherSelect('Sunny')} style={styles.weatherOption}>
            <Text>Sunny</Text>
            <Image source={require('./sunny.png')} style={styles.weatherImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWeatherSelect('Rainy')} style={styles.weatherOption}>
            <Text>Rainy</Text>
            <Image source={require('./RAINY.png')} style={styles.weatherImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWeatherSelect('Cloudy')} style={styles.weatherOption}>
            <Text>Cloudy</Text>
            <Image source={require('./Cloudy.png')} style={styles.weatherImage} />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  emotionSymbol: {
    textAlign: 'center',
    fontSize: 40,  // 调整表情符号的字体大小
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#176B87',
    textAlign: 'center',
  },
  diaryContainer: {
    flex: 9,
    marginTop: -15,
  },
  diaryContentContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 8,
    borderColor: 'gray',
    borderRadius: 20,
  },
  diaryInput: {
    height: 200,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#B4D4FF',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#176B87',
    textAlign: 'center',
  },
  entryContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryText: {
    fontSize: 16,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#DFE0E2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  selectedEntry: {
    backgroundColor: '#B6D6CC',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: '#F1FEC6',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  weatherOption: {
    padding: 25,
    marginVertical: 5,
    borderWidth:5,
    borderRadius:35,
  },
  weatherImage: {
    width: 100,
    height: 60,
    resizeMode: 'contain', // 適應 Image 的大小
    marginVertical: 5, // 調整圖片和文字之間的間距
  },
});

export default DiaryScreen;
