import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
        const acceptedFriendsList = async () => {
            try {
                const response = await fetch(`http://192.168.1.8:3000/accepted-friends/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setAcceptedFriends(data);
                }
            } catch (error) {
                console.log('Error showing the accepted friends', error);
            }
        };

        acceptedFriendsList();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity>
                {acceptedFriends.map((item, index) => (
                    <UserChat key={index} item={item} />
                ))}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
