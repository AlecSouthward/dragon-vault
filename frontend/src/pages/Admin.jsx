import "./css/Admin.css";

import { useEffect, useState } from "react";

import UserList from "../components/UserList";

import { sendRetrieveAllUsersRequest } from "../service/userService";
import CreateUserMenu from "../components/CreateUserMenu";

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateUserMenu, setShowCreateUserMenu] = useState(false);

    useEffect(() => {
        setLoading(true);

        sendRetrieveAllUsersRequest()
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="admin-menu-container">
            <div className="admin-menu">
                <h1>Admin Screen</h1>

                <div className="user-section">
                    <UserList users={users} loading={loading} />
                    <button onClick={() => setShowCreateUserMenu(true)}>Create User</button>
                </div>
            </div>

            {showCreateUserMenu && <CreateUserMenu hideMenu={() => setShowCreateUserMenu(false)} />}
        </div>
    );
}