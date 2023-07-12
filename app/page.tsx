'use client'

// import { useRouter } from 'next/navigation'

import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native-web';

// import { Metadata } from 'next'


// const columns = [
//    { key: 'id', name: 'ID' },
//    { key: 'title', name: 'Title' }
// ];

const DATA = [
    {
        'id': '1',
        'title': 'First Item',
    },
    {
        'id': '2',
        'title': 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
]

const Item = ({item}) => (
  <View>
      <Text>{item.title}</Text>
  </View>
);

export default function Page() {
    const renderItem = ({ item }) => {
        <View>
            <TouchableOpacity key={item.id}>
                <Text>{item.title}</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <SafeAreaView>
            <FlatList
                data={DATA}
                numColumns={2}
                renderItem={({item}) => <Item item={item} />}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
};
