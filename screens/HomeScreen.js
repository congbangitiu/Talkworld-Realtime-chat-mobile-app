import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useLayoutEffect, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import User from '../components/User';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const [currentUser, setCurrentUser] = useState();
    const [users, setUsers] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => <Text style={{ fontSize: 22, fontWeight: 'bold' }}>TalkWorld</Text>,
            // headerTitle: () => (<Text>hi</Text>),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Ionicons
                        onPress={() => navigation.navigate('Chats')}
                        name="chatbox-ellipses-outline"
                        size={24}
                        color="black"
                    />
                    <MaterialIcons
                        onPress={() => navigation.navigate('Friends')}
                        name="people-outline"
                        size={24}
                        color="black"
                    />
                    <MaterialIcons onPress={() => navigation.navigate('Login')} name="logout" size={24} color="black" />
                </View>
            ),
        });
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);

            axios
                .get(`http://192.168.1.8:3000/users/${userId}`)
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.log('Error retrieving users', error);
                });
        };

        fetchUsers();
    }, []);

    return (
        <View>
            <ScrollView style={{ padding: 15 }}>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({});
