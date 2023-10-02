import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TextInput,
    Pressable,
    Image,
} from 'react-native';
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from 'react';
import { Feather, Ionicons, MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
// import RNFS from 'react-native-fs';

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recipientData, setRecipientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState('');
    const route = useRoute();
    const { recipientId } = route.params;
    const [message, setMessage] = useState('');
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    };

    const handleContentSizeChange = () => {
        scrollToBottom();
    };

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://192.168.1.8:3000/messages/${userId}/${recipientId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            } else {
                console.log('Error showing messags', response.status.message);
            }
        } catch (error) {
            console.log('Error fetching messages', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchRecipientData = async () => {
            try {
                const response = await fetch(`http://192.168.1.8:3000/user/${recipientId}`);

                const data = await response.json();
                setRecipientData(data);
            } catch (error) {
                console.log('Error retrieving details', error);
            }
        };

        fetchRecipientData();
    }, []);

    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append('senderId', userId);
            formData.append('recipientId', recipientId);

            //if the message type id image or a normal text
            if (messageType === 'image') {
                formData.append('messageType', 'image');
                formData.append('imageFile', {
                    uri: imageUri,
                    name: 'image.jpg',
                    type: 'image/jpeg',
                });
            } else {
                formData.append('messageType', 'text');
                formData.append('messageText', message);
            }

            const response = await fetch('http://192.168.1.8:3000/messages', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('');
                setSelectedImage('');
                fetchMessages();
            }
        } catch (error) {
            console.log('error in sending the message', error);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>{selectedMessages.length}</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: 'cover',
                                }}
                                source={{ uri: recipientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold' }}>
                                {recipientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                        <Ionicons name="md-arrow-undo" size={24} color="black" />
                        <AntDesign name="pushpin" size={24} color="black" />
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    </View>
                ) : null,
        });
    }, [recipientData, selectedMessages]);

    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend('image', result.uri);
        }
    };

    const handleSelectMessage = (message) => {
        //check if the message is already selected
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) => previousMessages.filter((id) => id !== message._id));
        } else {
            setSelectedMessages((previousMessages) => [...previousMessages, message._id]);
        }
    };

    const deleteMessages = async (messageIds) => {
        try {
            const response = await fetch('http://192.168.1.8:3000/deleteMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: messageIds }),
            });

            if (response.ok) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id)),
                );

                fetchMessages();
            } else {
                console.log('Error deleting messages', response.status);
            }
        } catch (error) {
            console.log('Error deleting messages', error);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#F0F0F0' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={65}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={handleContentSizeChange}
            >
                {messages.map((item, index) => {
                    if (item.messageType === 'text') {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                              alignSelf: 'flex-end',
                                              backgroundColor: '#DCF8C6',
                                              padding: 8,
                                              maxWidth: '60%',
                                              borderRadius: 8,
                                              margin: 10,
                                          }
                                        : {
                                              alignSelf: 'flex-start',
                                              backgroundColor: 'white',
                                              padding: 8,
                                              margin: 10,
                                              borderRadius: 7,
                                              maxWidth: '60%',
                                          },

                                    isSelected && { width: '100%', backgroundColor: '#F0FFFF' },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        textAlign: isSelected ? 'right' : 'left',
                                    }}
                                >
                                    {item?.message}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 9,
                                        color: 'gray',
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === 'image') {
                        const isSelected = selectedMessages.includes(item._id);
                        const baseUrl =
                            'D:/OneDrive - VietNam National University - HCM INTERNATIONAL UNIVERSITY/IoT club/React Native/RealtimeChatApp/api/files/';
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split('/').pop();
                        const source = { uri: baseUrl + filename };
                        // source = {
                        //     uri: 'https://reactnative.dev/img/tiny_logo.png',
                        // };
                        // // const source={uri: 'D:/OneDrive - VietNam National University - HCM INTERNATIONAL UNIVERSITY/IoT club/React Native/RealtimeChatApp/api/files/1694235690256-523351443-image.jpg',}
                        // source={require('D:/OneDrive - VietNam National University - HCM INTERNATIONAL UNIVERSITY/IoT club/React Native/RealtimeChatApp/api/files/1694235690256-523351443-image.jpg')}
                        console.log(source);

                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                              alignSelf: 'flex-end',
                                              backgroundColor: '#DCF8C6',
                                              padding: 8,
                                              maxWidth: '60%',
                                              borderRadius: 7,
                                              margin: 10,
                                          }
                                        : {
                                              alignSelf: 'flex-start',
                                              backgroundColor: 'white',
                                              padding: 8,
                                              margin: 10,
                                              borderRadius: 7,
                                              maxWidth: '60%',
                                          },
                                    isSelected && { width: '100%', backgroundColor: '#F0FFFF' },
                                ]}
                            >
                                <View>
                                    <Image source={source} style={{ width: 200, height: 200, borderRadius: 7 }} />
                                    <Text
                                        style={{
                                            textAlign: 'right',
                                            fontSize: 9,
                                            position: 'absolute',
                                            right: 10,
                                            bottom: 7,
                                            color: 'white',
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#dddddd',
                    marginBottom: showEmojiSelector ? 0 : 25,
                    marginBottom: 25,
                }}
            >
                <Entypo
                    onPress={handleEmojiPress}
                    style={{ marginRight: 5 }}
                    name="emoji-happy"
                    size={24}
                    color="gray"
                />
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#dddddd',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                    }}
                    placeholder="Type your message..."
                />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginHorizontal: 8,
                    }}
                >
                    <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

                    <Feather name="mic" size={24} color="gray" />
                </View>

                {message ? (
                    <Pressable
                        onPress={() => handleSend('text')}
                        style={{
                            backgroundColor: '#007bff',
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                    </Pressable>
                ) : null}
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
