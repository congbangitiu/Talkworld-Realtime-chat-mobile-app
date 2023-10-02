import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    // useEffect(() => {
    //     const checkLoginStatus = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem('authToken');

    //             if (token) {
    //                 navigation.replace('Home');
    //             } else {
    //                 // token not found , show the login screen itself
    //             }
    //         } catch (error) {
    //             console.log('error', error);
    //         }
    //     };

    //     checkLoginStatus();
    // }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password,
        };

        axios
            .post('http://192.168.1.8:3000/login', user)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem('authToken', token);

                navigation.replace('Home');
            })
            .catch((error) => {
                Alert.alert('Login Error', 'Invalid email or password');
                console.log('Login Error', error);
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
                <KeyboardAvoidingView>
                    <View
                        style={{
                            marginTop: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#4A55A2', fontSize: 30, fontWeight: '700' }}>SIGN IN</Text>
                        <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 15 }}>Sign in to your account</Text>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Email</Text>

                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={{
                                    fontSize: email ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 0.5,
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
                                    fontSize: password ? 18 : 16,
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 0.5,
                                    marginVertical: 10,
                                    width: 300,
                                    paddingBottom: 5,
                                }}
                                placeholderTextColor={'black'}
                                placeholder="Enter your password"
                            />
                        </View>

                        <Pressable
                            onPress={handleLogin}
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
                                Login
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
                                Dont't have an account? <Text style={{ fontWeight: '700' }}>Sign Up</Text>
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({});
