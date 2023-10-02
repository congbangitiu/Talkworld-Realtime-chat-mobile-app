import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { UserType } from '../UserContext';

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch(`http://192.168.1.8:3000/friend-requests/sent/${userId}`);

                const data = await response.json();
                if (response.ok) {
                    setFriendRequests(data);
                } else {
                    console.log('Error', response.status);
                }
            } catch (error) {
                console.log('Error', error);
            }
        };

        fetchFriendRequests();
    }, []);

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await fetch(`http://192.168.1.8:3000/friends/${userId}`);

                const data = await response.json();

                if (response.ok) {
                    setUserFriends(data);
                } else {
                    console.log('Error retrieving user friends', response.status);
                }
            } catch (error) {
                console.log('Error message', error);
            }
        };

        fetchUserFriends();
    }, []);

    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch('http://192.168.1.8:3000/friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });

            if (response.ok) {
                setRequestSent(true);
            }
        } catch (error) {
            console.log('Error message', error);
        }
    };

    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        resizeMode: 'cover',
                    }}
                    source={{ uri: item.image }}
                />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item?.name}</Text>
                <Text style={{ marginTop: 4, color: 'gray' }}>{item?.email}</Text>
            </View>

            {userFriends.includes(item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: '#82CD47',
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                    }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Friends</Text>
                </Pressable>
            ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: 'gray',
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                    }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 13, fontWeight: '600' }}>Request sent</Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => sendFriendRequest(userId, item._id)}
                    style={{
                        backgroundColor: '#567189',
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                    }}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 13, fontWeight: '600' }}>Add friend</Text>
                </Pressable>
            )}
        </Pressable>
    );
};

export default User;

const styles = StyleSheet.create({});
