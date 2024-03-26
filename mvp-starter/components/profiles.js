
import { db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, doc, limit, query, updateDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
export default function Profiles() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const getUsers = async () => {
            setLoading(true);
            setLoading(false);
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);
            var users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
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
                    return (
                        <tr key={index}>
                            <td>{item.displayName}</td>
                            <td>{item.totalScore}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
        );
}
