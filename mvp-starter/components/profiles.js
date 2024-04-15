
import { db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, doc, limit, query, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase.js';
export default function Profiles() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [thisMonday, setThisMonday] = useState(getMonday(new Date()));

    let currentUser;
    function getMonday(d) {
            var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            const dateToParse = new Date(d.setDate(diff));
            const toRet = dateToParse.toLocaleDateString().replaceAll('/', '')
            return toRet;
    }
    const getUsers = async () => {
            setLoading(true);
            setLoading(false);
            const usersRef = collection(db, "users");
            const docRef = doc(db, 'users', auth.currentUser.email);
            currentUser = await getDoc(docRef);
            var users = [];
            const q = query(usersRef, orderBy(`${thisMonday}`, "desc"), limit(9));
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
            <tbody>
            {
                users.map((item, index) => {
                    if (index < users.length - 1) {
                        return (
                            <tr key={index} style={{}}>
                                <td className="number">{index + 1}</td>
                                <td className="name">{item.displayName}</td>
                                <td className='points'>{item[`${thisMonday}`]}</td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td className="number"></td>
                            <td className="name">{"You"}</td>
                            <td className="points">{item[`${thisMonday}`]}</td>
                        </tr>
                    )
                })
            }
            </tbody>
    </table>
        );
}
