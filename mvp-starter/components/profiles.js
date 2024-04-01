
import { db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, doc, limit, query, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase.js';
export default function Profiles() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    let currentUser;
    const getUsers = async () => {
            setLoading(true);
            setLoading(false);
            const usersRef = collection(db, "users");
            const docRef = doc(db, 'users', auth.currentUser.email);
            currentUser = await getDoc(docRef);
            var users = [];
            const q = query(usersRef, orderBy("totalScore", "desc"), limit(10));
            onSnapshot(q, (snapShot) => {
                snapShot.docs.forEach((doc) => {
                    users.push(doc.data());
                });
                users.push(currentUser.data())
                setUsers(users);
            })
    };
    useEffect(() => {
            getUsers();
    }, []);
    if (loading) {
            return <div>Loading...</div>;
    }
    return (
        <table className="styled-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            {
                users.map((item, index) => {
                    if (index < users.length - 1) {
                        return (
                            <tr key={index} style={{}}>
                                <td>{item.displayName}</td>
                                <td>{item.totalScore}</td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index} style={{ backgroundColor: 'lightblue' }}>
                            <td>{"You"}</td>
                            <td>{item.totalScore}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
        );
}
