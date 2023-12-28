import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { FAB, Appbar, Card, Avatar, IconButton, Divider } from 'react-native-paper';
import { collection, getDocs,doc,deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard({ navigation }) {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Assuming you have a function to handle the navigation to the "Update" screen
    const navigateToUpdateScreen = (id) => {
        navigation.navigate('Update', { id });
    };
    const deleteNoteFromFirestore = async (id) => {
        const noteRef = doc(db, 'notes', id);

        try {
            // Delete the note from Firestore
            await deleteDoc(noteRef);
            console.log('Note deleted successfully');
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    };
    const handleDelete = async (id) => {
        try {
            // Delete the note
            await deleteNoteFromFirestore(id);

            // After successful deletion, fetch and update the notes
            const updatedSubjects = subjects.filter((subject) => subject.id !== id);
            setSubjects(updatedSubjects);
        } catch (error) {
            console.error('Error deleting note: ', error);
        }
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'notes'));
                const subjectsData = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    subjectsData.push({
                        id: doc.id,
                        subject: data.subject,
                        description: data.description, // Add the description field
                    });
                });

                setSubjects(subjectsData);
            } catch (error) {
                console.error('Error fetching subjects: ', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleCardPress = (subject) => {
        setSelectedSubject(selectedSubject === subject ? null : subject);
    };

    const handleTapOutside = () => {
        setSelectedSubject(null);
    };

    return (
        <TouchableWithoutFeedback onPress={handleTapOutside}>
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title="Notes Taking App" />
                </Appbar.Header>

                <ScrollView style={styles.textInputContainer}>
                    {subjects.map((subject) => (
                        <TouchableWithoutFeedback key={subject.id} onPress={() => handleCardPress(subject)}>
                            <View style={styles.cardContainer}>
                                <Card.Title
                                    title={subject.subject}
                                    style={styles.color}
                                    left={(props) => <Avatar.Icon {...props} icon="dots-hexagon" />}
                                    right={(props) => (
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconButton
                                                {...props}
                                                icon="circle-edit-outline"
                                                onPress={() => navigateToUpdateScreen(subject.id)}
                                            />
                                            <IconButton
                                                {...props}
                                                icon="delete"
                                                onPress={() => handleDelete(subject.id)}
                                            />
                                        </View>
                                    )}
                                />
                                {selectedSubject === subject && (
                                    <Card>
                                        <Card.Content>
                                            <Text variant="bodyMedium">{subject.description}</Text>
                                        </Card.Content>
                                    </Card>
                                )}
                                <Divider />
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </ScrollView>

                <FAB
                    style={styles.fab}
                    icon="plus"
                    animated={true}
                    onPress={() => navigation.navigate('Create')}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    color: {
        backgroundColor: '#fff',
    },
    textInputContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    cardContainer: {
        marginBottom: 10, // Adjust the margin bottom value for spacing
    },
    textInput: {
        borderRadius: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
    },
});
