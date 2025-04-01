import "./RoleSelector.css"

const Roles = {
    MANAGER: "manager",
    BURGER: "burger",
    SIDE: "side",
    DRINK: "drink",
};

export default function RoleSelector({ selectedRole, setSelectedRole }) {
    return (
        <div className="RoleSelector">
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
