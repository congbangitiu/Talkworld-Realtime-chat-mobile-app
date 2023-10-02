import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://192.168.1.8:3000/friend-request/${userId}`);
            if (response.status === 200) {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image,
                }));

                setFriendRequests(friendRequestsData);
            }
        } catch (err) {
            console.log('Error message', err);
        }
    };

    console.log(friendRequests);
    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text style={{ fontSize: 25, fontWeight: '700' }}>Friend requests</Text>}

            {friendRequests.length > 0 ? (
                friendRequests.map((item, index) => (
                    <FriendRequest
                        key={index}
                        item={item}
                        friendRequests={friendRequests}
                        setFriendRequests={setFriendRequests}
                    />
                ))
            ) : (
                <Text style={{ textAlign: 'center', color: 'gray', fontWeight: '600', fontSize: 16, marginTop: 20 }}>
                    There is no friend request ...
                </Text>
            )}
        </View>
    );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
