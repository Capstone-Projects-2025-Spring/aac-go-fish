const Roles = {
    MANAGER: "manager",
    BURGER: "burger",
    SIDE: "side",
    DRINK: "drink",
};

export default function RoleSelector({ selectedRole, setSelectedRole }) {
    return (
        <div style={{position:"absolute", bottom: "1rem", right: "1rem", zIndex: "999999", alignItems: "center"}}>
            <h2>Select a Role</h2>
            <div>
                {Object.values(Roles).map((role) => (
                    <label key={role}>
                        <input
                            type="radio"
                            value={role}
                            checked={selectedRole === role}
                            onChange={() => setSelectedRole(role)}
                        />
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                ))}
            </div>
        </div>
    );
}
