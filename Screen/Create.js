import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
export default function Create({navigation}) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        try {
            // Access the "notes" collection in Firestore and add a new document
            const docRef = await addDoc(collection(db, 'notes'), {
                subject,
                description,
                timestamp: new Date(),
            });

            console.log('Document written with ID: ', docRef.id);

            // Reset form fields after submission
            setSubject('');
            setDescription('');
            navigation.navigate('Dashboard')
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={()=>navigation.navigate('Dashboard')} />
                <Appbar.Content title="Create Note" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <TextInput
                    label="Subject"
                    value={subject}
                    onChangeText={(text) => setSubject(text)}
                    style={styles.input}
                />

                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Submit
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});
