import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export default function Update({navigation}) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const route = useRoute();
    const { id } = route.params;

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteDoc = await getDoc(doc(db, 'notes', id));
                if (noteDoc.exists()) {
                    const data = noteDoc.data();
                    setSubject(data.subject);
                    setDescription(data.description);
                } else {
                    console.error('Note not found');
                }
            } catch (error) {
                console.error('Error fetching note: ', error);
            }
        };

        fetchNote();
    }, [id]);

    const handleSubmit = async () => {
        try {
            const noteRef = doc(db, 'notes', id);
            await updateDoc(noteRef, {
                subject,
                description,
            });
            console.log('Note updated successfully!');
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Error updating note: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction title="Update Note" onPress={() => navigation.navigate('Dashboard')} />
                <Appbar.Content title="Update Note" />
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
