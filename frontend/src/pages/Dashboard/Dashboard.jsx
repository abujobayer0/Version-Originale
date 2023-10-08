import useAdmin from "../../customHooks/useAdmin/useAdmin";

const Dashboard = () => {
    const [isAdmin, refetch, isLoading] = useAdmin();
    return (
        <div>
            {isAdmin ? (
                <div>
                    <h2 className="text-5xl">This is Admin</h2>
                </div>
            ) : (
                <div>
                    <h2 className="text-5xl">This is customer</h2>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
