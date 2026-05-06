import React from 'react';
import { View, Text, StyleSheet , ScrollView, StatusBar, useColorScheme} from 'react-native';
import {   SafeAreaView} from 'react-native-safe-area-context';
import Greeting from './src/components/Greeting';
import Counter from './src/components/Counter';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() == 'light';
  return (

    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
    <ScrollView >
     
   
    
      <Greeting name=' Kszyniu' age={40} isVip={true}/>
       
       <Greeting name=' Kszyniu' age={40} isVip={true}/>
        <Greeting name=' Kszynium' age={40} isVip={true}/>
         <Greeting name=' Kszyniu' age={40} isVip={true}/>
          <Greeting name=' Kszynium' age={40} isVip={true}/>
          <Greeting name=' Kszyniu' age={40} isVip={true}/>
          <Greeting name=' Kszynium' age={40} isVip={true}/>
          <Greeting name=' Kszyniu' age={40} isVip={true}/>
          <Greeting name=' Kszyniu' age={40} isVip={true}/>
          <Greeting name=' Kszyniu' age={40} isVip={true}/>
            <Counter />
          
    </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    backgroundColor: 'black',
  },

});

export default App;