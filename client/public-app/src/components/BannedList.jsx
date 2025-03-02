import {useEffect, useState} from "react";


import '../styles/BannedList.css'


export const BannedList = () => {

    const [banned, setBanned] = useState([]);
    useEffect( () => {
        fetch("/api/activity/banned", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            }
        })
            .then((res) => res.json())
            .then((data) => {setBanned(data)})
            .catch((err) => console.log(err));

    }, []);

    return (
        <section className="banned-list">
            <h2>Banned users</h2>
            <ul>
                {banned && banned.length > 0 ? (

                   banned.map((banned) => (
                       <li key={banned.id}>
                           <div className="banned-card">
                               <p>ID: {banned.user_id}</p>
                               <p>Username: {banned.user.username}</p>
                           </div>
                       </li>
                   ))
                ) : (
                    <l1>
                        <p>No banned users</p>
                    </l1>
                    )}
            </ul>

        </section>
    )
}