import React, { useEffect, useState } from 'react';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.user_name}!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h1>Please sign in</h1>
                    {/* Render sign-in form */}
                </div>
            )}
        </div>
    );
};

export default App;
