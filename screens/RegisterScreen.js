import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Alert,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const navigation = useNavigation();

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image,
        };

        // send a POST  request to the backend API to register the user
        axios
            .post('http://192.168.1.8:3000/register', user)
            .then((response) => {
                console.log(response);
                Alert.alert('Successful registration ', 'You have been registered successfully');
                setName('');
                setEmail('');
                setPassword('');
                setImage('');
            })
            .catch((error) => {
                Alert.alert('Registration error', 'An error occurred while registering');
                console.log('registration failed', error);
            });
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    padding: 10,
                    alignItems: 'center',
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <View
                        style={{
                            marginTop: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#4A55A2', fontSize: 30, fontWeight: '700' }}>REGISTER</Text>

                        <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 15 }}>Register to your account</Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Name</Text>

                            <TextInput
                                value={name}
                                onChangeText={(text) => setName(text)}
                                style={{
                                    fontSize: email ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 1,
                                    marginVertical: 10,
                                    width: 300,
                                    paddingBottom: 5,
                                }}
                                placeholderTextColor={'black'}
                                placeholder="Enter your name"
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Email</Text>

                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{
                                    fontSize: email ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 1,
                                    marginVertical: 10,
                                    width: 300,
                                    paddingBottom: 5,
                                }}
                                placeholderTextColor={'black'}
                                placeholder="Enter your mail"
                            />
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Password</Text>

                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                style={{
                                    fontSize: email ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 1,
                                    marginVertical: 10,
                                    width: 300,
                                    paddingBottom: 5,
                                }}
                                placeholderTextColor={'black'}
                                placeholder="Enter your password"
                            />
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Image</Text>

                            <TextInput
                                value={image}
                                onChangeText={(text) => setImage(text)}
                                style={{
                                    fontSize: email ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 1,
                                    marginVertical: 10,
                                    width: 300,
                                    paddingBottom: 5,
                                }}
                                placeholderTextColor={'black'}
                                placeholder="Add an avatar"
                            />
                        </View>

                        <Pressable
                            onPress={handleRegister}
                            style={{
                                width: 200,
                                backgroundColor: '#4A55A2',
                                padding: 15,
                                marginTop: 50,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                borderRadius: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                Register
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
                                Already have an account? <Text style={{ fontWeight: '700' }}>Sign In</Text>
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
