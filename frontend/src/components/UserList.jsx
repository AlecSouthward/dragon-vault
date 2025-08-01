import "./css/UserList.css";

import PropTypes from "prop-types";

const UserItem = ({ user }) => (
    <div className="user-item">
        <img
            src={user.profilePicture || "profile_picture_placeholder.jpg"}
            alt={user.username + " Profile Picture"}
            className="profile-picture"
        />

        <p>{user.username}</p>
    </div>
);

export default function UserList({ users }) {
    return (
        <div className="user-item-list">
            {users.map(user => <UserItem key={user.id} user={user} />)}
        </div>
    );
}

UserItem.propTypes = {
    user: PropTypes.object.isRequired
};

UserList.propTypes = {
    users: PropTypes.array.isRequired
};