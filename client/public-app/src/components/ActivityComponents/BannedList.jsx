/**
 * This component is used to display all the banned users in a list at the Activity.jsx page
 *
 * @param banned list of banned users
 * @param openPopUp function to toggle the popup window
 */



import '../../styles/BannedList.css'


export const BannedList = ({banned, openPopup}) => {
    return (
        <section className="banned-list">
            <h2>Banned users</h2>
            <ul>
                {banned && banned.length > 0 ? (
                   banned.map((user) => (
                       <li onClick={()=> openPopup(user.user)} key={user.user.user_id}>
                           <div className="banned-card">
                               <p>Username: <span>{user.user.username}</span></p>
                           </div>
                       </li>
                   ))
                ) : (
                    <li className="no-banned">
                        <p>No banned users</p>
                    </li>
                    )}
            </ul>
        </section>
    )
}